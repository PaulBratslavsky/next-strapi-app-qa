import { actions } from "@/data/actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={actions.auth.logoutUserAction}>
      <button type="submit">
        <LogOut className="w-6 h-6 hover:text-primary" />
      </button>
    </form>
  );
}