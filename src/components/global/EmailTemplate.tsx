interface EmailsProps {
  name: string;
  link: string;
}

interface WelcomeAccountEmailProps {
  name: string;
  email: string;
  password: string;
  link: string;
}

export const ResetPasswordEmailTemplate = ({ name, link }: EmailsProps) => {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "oklch(0.269 0 0)",
        color: "oklch(0.9645 0.0261 90.0969)",
        padding: "40px",
        maxWidth: "600px",
        margin: "auto",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <img
          src="https://www.miracleibharokhonre.com/images/mylogo.png"
          width={120}
          height={40}
          alt="MOJI Logo"
        />
        <span
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          MOJI SCHOOL
        </span>
      </div>

      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        Reset Your Password
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        Hi <strong>{name}</strong>,<br />
        <br />
        We received a request to reset your password. Click the button below to
        set a new one. If you didn’t request this, you can safely ignore this
        message.
      </p>
      <a
        href={link}
        style={{
          display: "inline-block",
          marginTop: "24px",
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "oklch(0.9645 0.0261 90.0969)",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
          border: "2px solid",
          borderColor: "oklch(0.9645 0.0261 90.0969)",
        }}
      >
        Reset Password
      </a>
      <p style={{ marginTop: "32px", fontSize: "14px", color: "#6b7280" }}>
        This link will expire in 24 hours.
      </p>
      <hr style={{ marginTop: "40px", borderColor: "#e5e7eb" }} />
      <footer style={{ fontSize: "12px", color: "#9ca3af", marginTop: "16px" }}>
        &copy; {new Date().getFullYear()} MOJI School Technology · Lagos,
        Nigeria
      </footer>
    </div>
  );
};

export const WelcomeAccountEmailTemplate = ({
  name,
  email,
  password,
  link,
}: WelcomeAccountEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "oklch(0.269 0 0)",
        color: "oklch(0.9645 0.0261 90.0969)",
        padding: "40px",
        maxWidth: "600px",
        margin: "auto",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <img
          src="https://www.miracleibharokhonre.com/images/mylogo.png"
          width={120}
          height={40}
          alt="MOJI Logo"
        />
        <span
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          MOJI SCHOOL
        </span>
      </div>

      {/* Body */}
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        Welcome to MOJI School!
      </h1>

      <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "16px" }}>
        Hi <strong>{name}</strong>,<br />
        <br />
        Your account has been successfully created. You can now sign in and
        start using the MOJI School platform.
      </p>

      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <p style={{ marginBottom: "12px" }}>
          <strong>Email:</strong> {email}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Temporary Password:</strong> {password}
        </p>
      </div>

      <a
        href={link}
        style={{
          display: "inline-block",
          marginTop: "12px",
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "oklch(0.9645 0.0261 90.0969)",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
          border: "2px solid",
          borderColor: "oklch(0.9645 0.0261 90.0969)",
        }}
      >
        Sign In to Your Account
      </a>

      <p
        style={{
          marginTop: "24px",
          fontSize: "14px",
          color: "#9ca3af",
        }}
      >
        Please change your password after signing in for the first time.
      </p>

      <hr style={{ marginTop: "40px", borderColor: "#e5e7eb" }} />

      <footer
        style={{
          fontSize: "12px",
          color: "#9ca3af",
          marginTop: "16px",
          textAlign: "center",
        }}
      >
        &copy; {new Date().getFullYear()} MOJI School Technology · Lagos,
        Nigeria
      </footer>
    </div>
  );
};
