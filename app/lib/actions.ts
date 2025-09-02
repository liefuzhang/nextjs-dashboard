"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
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
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
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
  // Validate form using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    location: formData.get("location"),
    status: formData.get("status"),
    image_url: formData.get("image_url") || "/customers/default.png",
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
    await sql`
      INSERT INTO customers (name, email, image_url, status, phone, company, location)
      VALUES (${name}, ${email}, ${
      image_url || "/customers/default.png"
    }, ${status}, ${phone}, ${company}, ${location})
    `;
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
  // Validate form using Zod
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    location: formData.get("location"),
    status: formData.get("status"),
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
  const { name, email, phone, company, location, status } =
    validatedFields.data;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, phone = ${phone}, company = ${company}, 
          location = ${location}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
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
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath("/dashboard/customers");
    return { message: "Customer deleted successfully." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Customer.",
    };
  }
}
