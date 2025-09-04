"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { saveUploadedFile, getFileFromFormData } from "./file-upload";
import { db, withTransaction } from "@/db";
import { customers, invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Customer form schemas
const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  status: z.enum(["active", "inactive"], {
    invalid_type_error: "Please select a status",
  }),
  image_url: z.string().optional(),
});

const CreateCustomer = CustomerFormSchema.omit({ id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    company?: string[];
    location?: string[];
    status?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    location?: string;
    status?: string;
  };
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database with transaction
  try {
    await withTransaction(async (tx) => {
      // First, verify customer exists
      const customer = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.id, customerId))
        .limit(1);

      if (customer.length === 0) {
        throw new Error("Customer not found");
      }

      // Then create the invoice
      await tx.insert(invoices).values({
        customerId,
        amount: amountInCents,
        status,
        date,
      });
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: error instanceof Error && error.message === "Customer not found"
        ? "Database Error: Customer does not exist."
        : "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  try {
    await db
      .update(invoices)
      .set({
        customerId,
        amount: amountInCents,
        status,
      })
      .where(eq(invoices.id, id));
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await db.delete(invoices).where(eq(invoices.id, id));
  revalidatePath("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// Customer server actions
export async function createCustomer(
  prevState: CustomerState,
  formData: FormData
) {
  // Handle file upload
  let imageUrl = "/customers/default.png";
  const avatarFile = getFileFromFormData(formData, "avatar");

  if (avatarFile) {
    try {
      imageUrl = await saveUploadedFile(avatarFile);
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload avatar image. Please try again.",
        values: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          company: formData.get("company") as string,
          location: formData.get("location") as string,
          status: formData.get("status") as string,
        },
      };
    }
  }

  // Validate form using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    location: formData.get("location"),
    status: formData.get("status"),
    image_url: imageUrl,
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
      values: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        company: formData.get("company") as string,
        location: formData.get("location") as string,
        status: formData.get("status") as string,
      },
    };
  }

  // Prepare data for insertion into the database
  const { name, email, phone, company, location, status, image_url } =
    validatedFields.data;

  // Insert data into the database
  try {
    await db.insert(customers).values({
      name,
      email,
      imageUrl: image_url || "/customers/default.png",
      status,
      phone,
      company,
      location,
    });
  } catch (error) {
    // If a database error occurs, return a more specific error
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }

  // Revalidate the cache for the customers page and redirect the user
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData
) {
  // Handle file upload (optional for updates)
  let imageUrl = undefined;
  const avatarFile = getFileFromFormData(formData, "avatar");

  if (avatarFile) {
    try {
      imageUrl = await saveUploadedFile(avatarFile);
    } catch (error) {
      return {
        message: "Failed to upload avatar image. Please try again.",
        values: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          company: formData.get("company") as string,
          location: formData.get("location") as string,
          status: formData.get("status") as string,
        },
      };
    }
  }

  // Validate form using Zod
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    location: formData.get("location"),
    status: formData.get("status"),
    image_url: imageUrl,
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Customer.",
      values: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        company: formData.get("company") as string,
        location: formData.get("location") as string,
        status: formData.get("status") as string,
      },
    };
  }

  // Prepare data for update
  const { name, email, phone, company, location, status, image_url } =
    validatedFields.data;

  try {
    if (image_url) {
      // Update with new image
      await db
        .update(customers)
        .set({
          name,
          email,
          phone,
          company,
          location,
          status,
          imageUrl: image_url,
        })
        .where(eq(customers.id, id));
    } else {
      // Update without changing image
      await db
        .update(customers)
        .set({
          name,
          email,
          phone,
          company,
          location,
          status,
        })
        .where(eq(customers.id, id));
    }
  } catch (error) {
    console.error("Database Error: Failed to Update Customer.", error);

    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }

  // Revalidate the cache for the customers page and redirect the user
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  try {
    await withTransaction(async (tx) => {
      // First, delete all related invoices
      await tx.delete(invoices).where(eq(invoices.customerId, id));
      
      // Then delete the customer
      const result = await tx.delete(customers).where(eq(customers.id, id));
      
      // Check if customer was actually deleted
      if (result.count === 0) {
        throw new Error("Customer not found");
      }
    });
    
    revalidatePath("/dashboard/customers");
    return { message: "Customer deleted successfully." };
  } catch (error) {
    return {
      message: error instanceof Error && error.message === "Customer not found"
        ? "Database Error: Customer not found."
        : "Database Error: Failed to Delete Customer.",
    };
  }
}
