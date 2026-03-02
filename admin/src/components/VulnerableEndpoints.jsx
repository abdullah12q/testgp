import React from "react";

// This component exposes vulnerable endpoints to automated security scanners
// It is intentionally hidden from normal users
const VulnerableEndpoints = () => {
  return (
    <div
      style={{ display: "none" }}
      aria-hidden="true"
      data-testid="vuln-endpoints"
    >
      {/* GET endpoint */}
      <a
        href={`${import.meta.env.VITE_API_URL || ""}/api/vulnerable/users/search?email=test`}
        id="vuln-search-link"
      >
        Search User
      </a>

      {/* POST Login endpoint */}
      <form
        action={`${import.meta.env.VITE_API_URL || ""}/api/vulnerable/login`}
        method="POST"
        id="vuln-login-form"
      >
        <input type="email" name="email" defaultValue="test@test.com" />
        <input type="password" name="password" defaultValue="password" />
        <button type="submit">Login</button>
      </form>

      {/* PUT Password update endpoint */}
      <form
        action={`${import.meta.env.VITE_API_URL || ""}/api/vulnerable/users/password`}
        method="PUT"
        id="vuln-password-form"
      >
        <input type="email" name="email" defaultValue="test@test.com" />
        <input type="password" name="newPassword" defaultValue="newpassword" />
        <button type="submit">Update Password</button>
      </form>

      {/* POST Products search endpoint */}
      <form
        action={`${import.meta.env.VITE_API_URL || ""}/api/vulnerable/products/search`}
        method="POST"
        id="vuln-products-form"
      >
        <input type="text" name="name" defaultValue="shoes" />
        <button type="submit">Search Products</button>
      </form>

      {/* POST User lookup endpoint */}
      <form
        action={`${import.meta.env.VITE_API_URL || ""}/api/vulnerable/users/lookup`}
        method="POST"
        id="vuln-lookup-form"
      >
        <input type="email" name="email" defaultValue="test@test.com" />
        <button type="submit">Lookup User</button>
      </form>
    </div>
  );
};

export default VulnerableEndpoints;
