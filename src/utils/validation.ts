import { RegistrationData } from "@/types/auth";

export function validateRegistration(data: RegistrationData): string | null {
  if (!data.fullName.trim()) {
    return "Full name is required";
  }

  if (!data.email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.email)) {
    return "Please enter a valid email address";
  }

  if (!data.mobile.trim()) {
    return "Mobile number is required";
  }

  if (!/^\d{10}$/.test(data.mobile)) {
    return "Mobile number must contain exactly 10 digits";
  }

  if (!data.address.trim()) {
    return "Address is required";
  }

  if (!data.city.trim()) {
    return "City is required";
  }

  if (!data.password) {
    return "Password is required";
  }

  if (data.password.length < 6) {
    return "Password must contain at least 6 characters";
  }

  if (data.password !== data.confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}
