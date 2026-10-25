import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** After signing in, return to where the person came from (or the account). */
export function useAfterAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return useCallback(() => {
    navigate(from && from.startsWith("/") ? from : "/account", { replace: true });
  }, [navigate, from]);
}
