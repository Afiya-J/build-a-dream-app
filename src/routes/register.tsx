import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_NAME, DEPARTMENTS, SEMESTERS_BY_YEAR, YEARS } from "@/lib/constants";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — CampusLife" },
      {
        name: "description",
        content:
          "Register on CampusLife with your KRCT details to share resources, events and more.",
      },
      { property: "og:title", content: "Create your account — CampusLife" },
      {
        property: "og:description",
        content: "Register on CampusLife with your KRCT department, year and semester.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [year, setYear] = useState<string>("");

  const semesters = year ? SEMESTERS_BY_YEAR[Number(year) as (typeof YEARS)[number]] : [];

  return (
    <main className="flex min-h-screen items-start justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="size-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join {APP_NAME} with your college details
          </p>
        </div>

        <form
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="space-y-1.5">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" name="fullName" autoComplete="name" className="h-11" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-number">Registration number</Label>
            <Input
              id="reg-number"
              name="registrationNumber"
              inputMode="numeric"
              autoComplete="username"
              placeholder="e.g. 811722104001"
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <Select name="department">
              <SelectTrigger id="department" className="h-11">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="year">Year</Label>
              <Select name="year" value={year} onValueChange={setYear}>
                <SelectTrigger id="year" className="h-11">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      Year {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="semester">Semester</Label>
              <Select name="semester" disabled={!year}>
                <SelectTrigger id="semester" className="h-11">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="h-11"
            />
          </div>

          <Button type="submit" className="h-11 w-full">
            Create account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
