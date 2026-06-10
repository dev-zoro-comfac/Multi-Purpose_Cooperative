"use client";

import { ReactNode, useEffect } from "react";

import {
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Link as MuiLink,
  Stack,
  Paper,
} from "@mui/material";
import NextLink from "next/link";
import { useGetFilteredMenu } from "@/components/ui/dashboard/drawer/useGetFilteredMenu";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useAuthenticatedUser } from "@/features/auth/api/useAuthenticatedUser";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLoans } from "@/lib/api/loan";
import { getMembers } from "@/lib/api/member";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";

const DashboardPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: authResponse } = useAuthenticatedUser();
  const authUser = authResponse?.data;

  useEffect(() => {
  const roles = (
  authUser as {
    roles?: string[];
  } | null
)?.roles ?? [];
  const isBorrowerOnly =
    (roles.includes("member") || roles.includes("non-member")) &&
    !roles.includes("admin") &&
    !roles.includes("accounting");

  if (isBorrowerOnly) {
    router.replace("/dashboard/member");
  }
}, [authUser, router]);

  const filteredMenu = useGetFilteredMenu() ?? [];

  const { data: loansResponse } = useQuery({
  queryKey: ["loan-applications"],
  queryFn: getLoans,
});

  const { data: membersResponse } = useQuery({
  queryKey: ["members"],
  queryFn: getMembers,
});

const loans =
  loansResponse?.data?.data ??
  loansResponse?.data ??
  [];

const members =
  membersResponse?.data?.data ??
  membersResponse?.data ??
  [];

const totalLoans = loans.length;
const totalMembers = members.length;

const activeMembers = members.filter(
  (member: { status?: string | null }) =>
    member.status === "active" || !member.status
).length;

const totalShareCapital = members.reduce(
  (
    sum: number,
    member: {
      share_capital?: number | string | null;
    }
  ) => sum + Number(member.share_capital || 0),
  0
);

const totalContribution = members.reduce(
  (
    sum: number,
    member: {
      total_contribution?: number | string | null;
    }
  ) => sum + Number(member.total_contribution || 0),
  0
);

const pendingLoans = loans.filter(
  (
  loan: {
    status?: string | null;
  }
) =>
    loan.status === "pending" ||
    loan.status === "created" ||
    loan.status === "submitted_for_evaluation"
).length;

const releasedLoans = loans.filter(
  (
  loan: {
    status?: string | null;
  }
) => loan.status === "released"
).length;

const totalReleasedAmount = loans
  .filter(
    (
      loan: {
        status?: string | null;
      }
    ) => loan.status === "released"
  )
  .reduce(
    (
      sum: number,
      loan: {
        amount_requested?: number | string | null;
      }
    ) => sum + Number(loan.amount_requested || 0),
    0
  );

const publicApplications = loans.filter(
  (loan: { application_source?: string | null }) =>
    loan.application_source === "public"
).length;

const submittedForEvaluation = loans.filter(
  (loan: { status?: string | null }) =>
    loan.status === "submitted_for_evaluation"
).length;

const formatPeso = (value: number) =>
  `₱${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <Container maxWidth="xl">
      <Paper
  elevation={0}
  sx={{
    p: 4,
    mt: { md: 4, xs: 3 },
    mb: 4,
    borderRadius: 4,
    background:
      "linear-gradient(135deg, rgba(31, 111, 74, 0.14) 0%, #ffffff 72%)",
    border: theme => `1px solid ${theme.palette.primary[100]}`,
  }}
>
  <Typography variant="h3" fontWeight={700}>
    Welcome,{" "}
    <Typography component="span" variant="h3" color="primary.dark" fontWeight={700}>
      {authUser?.name}
    </Typography>
    !
  </Typography>

  <Typography color="text.secondary" sx={{ mt: 1 }}>
    Monitor cooperative members, share capital, contributions, loan applications, and accounting workflow progress.
  </Typography>
</Paper>

<Typography
  variant="h4"
  fontWeight={700}
  sx={{ mb: 2 }}
>
  Action Needed
</Typography>

<Typography
  color="text.secondary"
  sx={{ mb: 3 }}
>
  Start with the records that usually need admin or accounting attention.
</Typography>

<Grid container spacing={2} sx={{ mb: 4 }}>
  <Grid size={{ xs: 12, md: 4 }}>
    <ActionCard
      title="Pending Loan Review"
      value={pendingLoans}
      description="Applications waiting for checking, evaluation, or review."
      href="/dashboard/accounting/loans"
      action="Review applications"
    />
  </Grid>

  <Grid size={{ xs: 12, md: 4 }}>
    <ActionCard
      title="Public Applications"
      value={publicApplications}
      description="Walk-in or online borrowers who may need account setup after review."
      href="/dashboard/accounting/loans"
      action="Open loan register"
    />
  </Grid>

  <Grid size={{ xs: 12, md: 4 }}>
    <ActionCard
      title="For Evaluation"
      value={submittedForEvaluation}
      description="Loans submitted for the cooperative evaluation workflow."
      href="/dashboard/accounting/loans"
      action="Continue workflow"
    />
  </Grid>
</Grid>

<Stack
  direction={{ xs: "column", sm: "row" }}
  spacing={1.5}
  sx={{ mb: 4 }}
>
  <Button
    component={NextLink}
    href="/dashboard/accounting/loans"
    variant="contained"
    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
  >
    Review Loan Applications
  </Button>
  <Button
    component={NextLink}
    href="/dashboard/members"
    variant="outlined"
    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
  >
    Manage Members
  </Button>
  <Button
    component={NextLink}
    href="/dashboard/users/create"
    variant="outlined"
    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
  >
    Create User Account
  </Button>
  <Button
    component={NextLink}
    href="/dashboard/roles"
    variant="text"
    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
  >
    Manage Roles
  </Button>
</Stack>

<Typography
  variant="h4"
  fontWeight={700}
  sx={{ mb: 2 }}
>
  Cooperative Overview
</Typography>

<Typography
  color="text.secondary"
  sx={{ mb: 3 }}
>
  Summary of member records, capital contributions, and cooperative account activity.
</Typography>

<Grid container spacing={2} sx={{ mb: 4 }}>
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Registered Members"
      value={totalMembers}
      icon={<GroupsOutlinedIcon />}
      color="primary.main"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Active Members"
      value={activeMembers}
      icon={<CheckCircleOutlineOutlinedIcon />}
      color="success.main"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Total Share Capital"
      value={formatPeso(totalShareCapital)}
      icon={<SavingsOutlinedIcon />}
      color="secondary.main"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Total Contributions"
      value={formatPeso(totalContribution)}
      icon={<PaymentsOutlinedIcon />}
      color="info.main"
    />
  </Grid>
</Grid>

<Typography
  variant="h4"
  fontWeight={700}
  sx={{ mb: 2 }}
>
  Loan Operations
</Typography>

<Typography
  color="text.secondary"
  sx={{ mb: 3 }}
>
  Track loan application volume, pending reviews, and released loan amounts.
</Typography>

<Grid container spacing={2} sx={{ mb: 4 }}>
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Total Loans"
      value={totalLoans}
      icon={<AssignmentOutlinedIcon />}
      color="primary.main"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Pending Loan Review"
      value={pendingLoans}
      icon={<PendingActionsOutlinedIcon />}
      color="warning.main"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Released Loans"
      value={releasedLoans}
      icon={<CheckCircleOutlineOutlinedIcon />}
      color="success.main"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardStat
      title="Released Amount"
      value={formatPeso(totalReleasedAmount)}
      icon={<PaymentsOutlinedIcon />}
      color="secondary.main"
    />
  </Grid>
</Grid>

<Typography
  variant="h4"
  fontWeight={700}
  sx={{ mb: 2 }}
>
  Management Modules
</Typography>

<Typography
  color="text.secondary"
  sx={{ mb: 3 }}
>
  Choose a module to review records, manage applications, or continue workflow tasks.
</Typography>

<Grid container spacing={3} sx={{ mb: 4 }}>
  {filteredMenu
    .flatMap(group => group.children ?? [])
    .filter(item => item.url !== pathname)
    .map(item => (
      <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          elevation={2}
          sx={{
            height: "100%",
            borderRadius: 3,
            border: theme => `1px solid ${theme.palette.divider}`,
            transition: "0.2s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
              borderColor: "primary.main",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <MuiLink
              href={item.url}
              component={NextLink}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                component="span"
                sx={{ color: theme => theme.palette.secondary.dark }}
              >
                {item.title}
              </Typography>
              <ArrowForwardOutlinedIcon
                sx={{
                  color: "secondary.main",
                  fontSize: 18,
                }}
              />
            </MuiLink>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.5,
              }}
            >
              {getModuleDescription(item.id, item?.description)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
</Grid>
    </Container>
  );
};

const getModuleDescription = (id: string, fallback?: string) => {
  const descriptions: Record<string, string> = {
    home: "Open the cooperative admin overview and daily monitoring dashboard.",
    user: "Manage staff, accounting, and borrower portal accounts.",
    "user-list": "Review all user accounts connected to the cooperative portal.",
    "user-create": "Create staff, accounting, or borrower access accounts.",
    "user-import": "Upload prepared user records using the import template.",
    "roles-and-permissions":
      "Control access for admin, accounting, and cooperative staff users.",
    profile: "Review your own account profile and login information.",
    members: "Maintain cooperative member records, contributions, and setup links.",
    "accounting-loans":
      "Review, approve, release, and monitor cooperative loan applications.",
  };

  return descriptions[id] || fallback || "Open this cooperative module.";
};

const ActionCard = ({
  title,
  value,
  description,
  href,
  action,
}: {
  title: string;
  value: string | number;
  description: string;
  href: string;
  action: string;
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography color="text.secondary" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight={800} color="primary" sx={{ mt: 1 }}>
          {value}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, minHeight: 48 }}>
          {description}
        </Typography>
        <Button
          component={NextLink}
          href={href}
          variant="text"
          sx={{ mt: 1.5, px: 0, textTransform: "none", fontWeight: 700 }}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

const DashboardStat = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            bgcolor: "background.default",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} color={color}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
export default DashboardPage;
