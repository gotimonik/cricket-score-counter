import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  CampaignRounded,
  CloseSharp,
  DeleteRounded,
  EditRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import ConfirmDialog from "./ConfirmDialog";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import PromoBannerService, {
  type PromoBannerInput,
  type PromoBannerRecord,
} from "../services/PromoBannerService";
import { ADMIN_ANALYTICS_EMAIL } from "../utils/constant";

const cardSx = {
  p: { xs: 1.75, sm: 2.25 },
  borderRadius: 3,
  border:
    "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
  background: "rgba(255,255,255,0.86)",
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "#fff",
    minHeight: 54,
  },
};

type BannerFormState = {
  show: boolean;
  order: number;
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
  buttonText: string;
  ctaUrl: string;
  buttonText1: string;
  buttonLink1: string;
  openInNewTab: boolean;
};

const EMPTY_FORM: BannerFormState = {
  show: false,
  order: 0,
  title: "",
  subTitle: "",
  description: "",
  imageUrl: "",
  bannerUrl: "",
  buttonText: "",
  ctaUrl: "",
  buttonText1: "",
  buttonLink1: "",
  openInNewTab: true,
};

// The four fields required for every banner (matches the "advertisement
// card" fields people configure -- title/image/button/link). subTitle,
// description and the optional second button are not required.
const REQUIRED_FIELDS = [
  "title",
  "imageUrl",
  "buttonText",
  "ctaUrl",
] as const;
type RequiredField = (typeof REQUIRED_FIELDS)[number];

const recordToForm = (banner: PromoBannerRecord): BannerFormState => ({
  show: banner.show,
  order: banner.order,
  title: banner.title,
  subTitle: banner.subTitle,
  description: banner.description,
  imageUrl: banner.imageUrl,
  bannerUrl: banner.bannerUrl,
  buttonText: banner.buttonText,
  ctaUrl: banner.ctaUrl,
  buttonText1: banner.buttonText1,
  buttonLink1: banner.buttonLink1,
  openInNewTab: banner.openInNewTab,
});

const PromoBannerAdminPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState<"checking" | "denied" | "ready">(
    "checking",
  );

  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate("/login", { state: { next_redirect: location.pathname } });
      return;
    }

    const user = AuthService.getUser() as { email?: string } | null;
    if (user?.email?.toLowerCase() !== ADMIN_ANALYTICS_EMAIL) {
      setStatus("denied");
      return;
    }

    setStatus("ready");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: banners,
    error: loadError,
    isLoading,
    mutate,
  } = useSWR(
    status === "ready" ? "admin-promo-banners" : null,
    () => PromoBannerService.getHomeBannersAdmin(),
    { revalidateOnFocus: false },
  );

  const [notice, setNotice] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBannerRecord | null>(
    null,
  );
  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<RequiredField, boolean>>
  >({});
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<PromoBannerRecord | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const openCreateDialog = () => {
    setEditingBanner(null);
    setForm({ ...EMPTY_FORM, order: banners?.length ?? 0 });
    setTouched({});
    setAttemptedSave(false);
    setSaveError("");
    setDialogOpen(true);
  };

  const openEditDialog = (banner: PromoBannerRecord) => {
    setEditingBanner(banner);
    setForm(recordToForm(banner));
    setTouched({});
    setAttemptedSave(false);
    setSaveError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const updateField = <K extends keyof BannerFormState>(
    key: K,
    value: BannerFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: RequiredField) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const fieldError = (key: RequiredField): string | undefined => {
    if (form[key].trim()) return undefined;
    if (!touched[key] && !attemptedSave) return undefined;
    return t("This field is required.");
  };

  const hasBlockingErrors = REQUIRED_FIELDS.some((key) => !form[key].trim());
  const secondButtonMismatch =
    Boolean(form.buttonText1.trim()) !== Boolean(form.buttonLink1.trim());

  const handleSave = async () => {
    setAttemptedSave(true);
    if (hasBlockingErrors || secondButtonMismatch) {
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      const payload: PromoBannerInput = {
        show: form.show,
        order: form.order,
        title: form.title.trim(),
        subTitle: form.subTitle.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        bannerUrl: form.bannerUrl.trim(),
        buttonText: form.buttonText.trim(),
        ctaUrl: form.ctaUrl.trim(),
        buttonText1: form.buttonText1.trim(),
        buttonLink1: form.buttonLink1.trim(),
        openInNewTab: form.openInNewTab,
      };
      if (editingBanner) {
        await PromoBannerService.updateHomeBanner(editingBanner.id, payload);
      } else {
        await PromoBannerService.createHomeBanner(payload);
      }
      await mutate();
      setDialogOpen(false);
      setNotice({
        open: true,
        message: editingBanner ? t("Banner updated") : t("Banner created"),
        severity: "success",
      });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : t("Unable to save the banner right now."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await PromoBannerService.deleteHomeBanner(deleteTarget.id);
      await mutate();
      setNotice({ open: true, message: t("Banner deleted"), severity: "success" });
    } catch (error) {
      setNotice({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : t("Unable to delete the banner right now."),
        severity: "error",
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <MetaHelmet
        pageTitle={t("Home Banners")}
        canonical={location.pathname}
        description={t(
          "Manage the promotional banners shown on the Cricket Score Counter home page.",
        )}
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: 820, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow: "0 10px 30px rgba(8, 26, 56, 0.14)",
              p: { xs: 2, sm: 3 },
            }}
          >
            <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: {
                  xs: "calc(24px * var(--app-font-scale, 1))",
                  sm: "calc(30px * var(--app-font-scale, 1))",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CampaignRounded sx={{ color: "#0b7f61" }} />
                <span>{t("Home Banners")}</span>
              </Stack>
            </PageTitleWithBack>

            {status === "checking" && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {status === "denied" && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {t("This page is only available to the app owner.")}
              </Alert>
            )}

            {status === "ready" && loadError && (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
                {t("Unable to load banners right now.")}
              </Alert>
            )}

            {status === "ready" && isLoading && !banners && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {status === "ready" && banners && (
              <Stack spacing={2.5}>
                <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                  {t(
                    "These cards rotate near the top of the home page for every visitor. Add as many as you like -- changes reach everyone within a few minutes, no app update needed.",
                  )}
                </Typography>

                <Button
                  data-ga-click="add_promo_banner"
                  variant="outlined"
                  startIcon={<AddRounded />}
                  onClick={openCreateDialog}
                  sx={{ borderRadius: 99, alignSelf: "flex-start", fontWeight: 800 }}
                >
                  {t("Add banner")}
                </Button>

                {banners.length === 0 ? (
                  <Paper elevation={0} sx={cardSx}>
                    <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                      {t("No banners yet. Add one to show it on the home page.")}
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={1.5}>
                    {banners.map((banner) => (
                      <Paper
                        key={banner.id}
                        elevation={0}
                        sx={{
                          ...cardSx,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            flexShrink: 0,
                            borderRadius: 2,
                            overflow: "hidden",
                            background: "rgba(24,90,157,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {banner.imageUrl ? (
                            <Box
                              component="img"
                              src={banner.imageUrl}
                              alt=""
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <CampaignRounded sx={{ color: "#185a9d", opacity: 0.5 }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: "#0c3558",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {banner.title || t("(Untitled banner)")}
                            </Typography>
                            <Chip
                              size="small"
                              label={banner.show ? t("Live") : t("Hidden")}
                              color={banner.show ? "success" : "default"}
                              sx={{ fontWeight: 700, flexShrink: 0 }}
                            />
                          </Stack>
                          {banner.subTitle && (
                            <Typography
                              sx={{
                                color: "#526274",
                                fontWeight: 600,
                                fontSize: 13,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {banner.subTitle}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          aria-label={t("Edit banner")}
                          onClick={() => openEditDialog(banner)}
                          sx={{ color: "var(--app-accent-text, #185a9d)" }}
                        >
                          <EditRounded fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label={t("Delete banner")}
                          onClick={() => setDeleteTarget(banner)}
                          sx={{ color: "#c0392b" }}
                        >
                          <DeleteRounded fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>

      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          onClose={closeDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ position: "relative", pr: 6, fontWeight: 900 }}>
            {editingBanner ? t("Edit banner") : t("Add banner")}
            <IconButton
              aria-label={t("Close")}
              onClick={closeDialog}
              sx={{
                position: "absolute",
                right: 10,
                top: 10,
                color: "var(--app-accent-text, #185a9d)",
              }}
            >
              <CloseSharp fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.show}
                    onChange={(event) =>
                      updateField("show", event.target.checked)
                    }
                  />
                }
                label={t("Show banner to all users")}
                sx={{ "& .MuiFormControlLabel-label": { fontWeight: 700 } }}
              />

              <TextField
                label={t("Title")}
                required
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                onBlur={() => markTouched("title")}
                error={Boolean(fieldError("title"))}
                helperText={fieldError("title")}
                fullWidth
                sx={textFieldSx}
              />
              <TextField
                label={t("Sub-title")}
                value={form.subTitle}
                onChange={(event) =>
                  updateField("subTitle", event.target.value)
                }
                fullWidth
                sx={textFieldSx}
              />
              <TextField
                label={t("Description")}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                multiline
                minRows={2}
                fullWidth
                sx={textFieldSx}
              />
              <TextField
                label={t("Image URL")}
                required
                value={form.imageUrl}
                onChange={(event) =>
                  updateField("imageUrl", event.target.value)
                }
                onBlur={() => markTouched("imageUrl")}
                error={Boolean(fieldError("imageUrl"))}
                helperText={fieldError("imageUrl")}
                placeholder="https://…"
                fullWidth
                sx={textFieldSx}
              />
              {form.imageUrl.trim() && (
                <Box
                  component="img"
                  src={form.imageUrl.trim()}
                  alt={t("Banner image preview")}
                  sx={{
                    width: "100%",
                    maxHeight: 180,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid rgba(8,26,56,0.12)",
                  }}
                />
              )}
              <TextField
                label={t("Banner URL (background image)")}
                value={form.bannerUrl}
                onChange={(event) =>
                  updateField("bannerUrl", event.target.value)
                }
                helperText={t(
                  "Optional. Shown as a full-width background behind the whole card, separate from the image above.",
                )}
                placeholder="https://…"
                fullWidth
                sx={textFieldSx}
              />
              {form.bannerUrl.trim() && (
                <Box
                  component="img"
                  src={form.bannerUrl.trim()}
                  alt={t("Banner background preview")}
                  sx={{
                    width: "100%",
                    maxHeight: 180,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid rgba(8,26,56,0.12)",
                  }}
                />
              )}
              <TextField
                label={t("Button text")}
                required
                value={form.buttonText}
                onChange={(event) =>
                  updateField("buttonText", event.target.value)
                }
                onBlur={() => markTouched("buttonText")}
                error={Boolean(fieldError("buttonText"))}
                helperText={fieldError("buttonText")}
                fullWidth
                sx={textFieldSx}
              />
              <TextField
                label={t("Button link (CTA URL)")}
                required
                value={form.ctaUrl}
                onChange={(event) => updateField("ctaUrl", event.target.value)}
                onBlur={() => markTouched("ctaUrl")}
                error={Boolean(fieldError("ctaUrl"))}
                placeholder="https://… or /a-page-in-the-app"
                fullWidth
                sx={textFieldSx}
                helperText={
                  fieldError("ctaUrl") ??
                  t(
                    "A link starting with / opens inside the app. Anything else opens as an external link.",
                  )
                }
              />

              <Typography sx={{ fontWeight: 800, color: "#0c3558", pt: 1 }}>
                {t("Second button (optional)")}
              </Typography>
              <TextField
                label={t("Button text")}
                value={form.buttonText1}
                onChange={(event) =>
                  updateField("buttonText1", event.target.value)
                }
                fullWidth
                sx={textFieldSx}
              />
              <TextField
                label={t("Button link")}
                value={form.buttonLink1}
                onChange={(event) =>
                  updateField("buttonLink1", event.target.value)
                }
                placeholder="https://… or /a-page-in-the-app"
                fullWidth
                sx={textFieldSx}
              />
              {secondButtonMismatch && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  {t(
                    "Set both the second button's text and link, or leave both empty.",
                  )}
                </Alert>
              )}

              <TextField
                label={t("Order")}
                type="number"
                value={form.order}
                onChange={(event) =>
                  updateField("order", Number(event.target.value) || 0)
                }
                helperText={t(
                  "Lower numbers show first when more than one banner is live.",
                )}
                sx={{ ...textFieldSx, maxWidth: 160 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.openInNewTab}
                    onChange={(event) =>
                      updateField("openInNewTab", event.target.checked)
                    }
                  />
                }
                label={t("Open external links in a new tab")}
                sx={{ "& .MuiFormControlLabel-label": { fontWeight: 600 } }}
              />

              {attemptedSave && (hasBlockingErrors || secondButtonMismatch) && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {hasBlockingErrors
                    ? t("Fill in every required field before saving.")
                    : t(
                        "Set both the second button's text and link, or leave both empty.",
                      )}
                </Alert>
              )}
              {saveError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {saveError}
                </Alert>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeDialog} sx={{ fontWeight: 700 }}>
              {t("Cancel")}
            </Button>
            <Button
              data-ga-click="save_promo_banner"
              variant="contained"
              disabled={saving}
              onClick={handleSave}
              sx={{ borderRadius: 99, fontWeight: 800, px: 3 }}
            >
              {saving ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                t("Save banner")
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t("Delete this banner?")}
        content={t(
          "This removes it from the home page immediately. This can't be undone.",
        )}
        confirmText={deleting ? t("Deleting…") : t("Delete")}
        cancelText={t("Cancel")}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <Snackbar
        open={notice.open}
        autoHideDuration={3000}
        onClose={() => setNotice((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={notice.severity}
          variant="filled"
          onClose={() => setNotice((prev) => ({ ...prev, open: false }))}
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          {notice.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PromoBannerAdminPage;
