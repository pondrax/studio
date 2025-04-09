import { z } from 'zod';

// Function to Convert JSON Schema → Zod Schema
function jsonToZod(schema: any): any {
  if (schema.type === "string") {
    if (schema.format === "date-time" || schema.format === "date") {
      let zodField = z.coerce.date(); // Convert string to Date
      return schema.required ? zodField : zodField.optional();
    }

    let zodField = z.string();
    if (schema.minLength !== undefined) {
      zodField = zodField.min(schema.minLength, `Minimum length is ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined) {
      zodField = zodField.max(schema.maxLength, `Maximum length is ${schema.maxLength}`);
    }
    if (schema.format === "email") {
      zodField = zodField.email("Invalid email format");
    }
    if (schema.pattern) {
      zodField = zodField.regex(new RegExp(schema.pattern), "Invalid format");
    }

    return schema.required ? zodField : zodField.optional();
  }

  if (schema.type === "number" || schema.type === "integer") {
    let zodField = schema.type === "integer" ? z.number().int() : z.number();

    if (schema.minimum !== undefined) {
      zodField = zodField.min(schema.minimum, `Minimum value is ${schema.minimum}`);
    }
    if (schema.maximum !== undefined) {
      zodField = zodField.max(schema.maximum, `Maximum value is ${schema.maximum}`);
    }

    return schema.required ? zodField : zodField.optional();
  }

  if (schema.type === "boolean") {
    return schema.required ? z.boolean() : z.boolean().optional();
  }

  if (schema.type === "array" && schema.items) {
    return schema.required ? z.array(jsonToZod(schema.items)) : z.array(jsonToZod(schema.items)).optional();
  }

  if (schema.type === "object" && schema.properties) {
    const shape: Record<string, any> = {};
    for (const key in schema.properties) {
      let fieldSchema = jsonToZod(schema.properties[key]);

      // Handle per-property "required"
      if (schema.properties[key].required) {
        shape[key] = fieldSchema;
      } else {
        shape[key] = fieldSchema.optional();
      }
    }
    return z.object(shape);
  }

  return z.any(); // Fallback for unknown types
}

// Example JSON Schema with Date Support
const jsonSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 5,
      format: "email",
      required: true
    },
    password: {
      type: "string",
      minLength: 8,
      pattern: "^(?=.*[A-Z])(?=.*[0-9]).*$",
      required: true
    },
    birthDate: {
      type: "string",
      format: "date-time", // or "date"
      required: true
    },
    age: {
      type: "number",
      minimum: 18,
      required: true
    },
    isActive: {
      type: "boolean"
    },
    tags: {
      type: "array",
      items: {
        type: "string"
      }
    }
  }
};

// Convert JSON Schema to Zod
const zodSchema = jsonToZod(jsonSchema);

// **Infer TypeScript Type from Zod Schema**
type UserSchema = z.infer<typeof zodSchema>;

// **Example Usage**
const user: UserSchema = {
  email: "test@example.com",
  password: "Test1234",
  birthDate: new Date("2000-01-01"),
  age: 25,
  isActive: true,
  tags: ["zod", "validation"]
};

console.log(user);
