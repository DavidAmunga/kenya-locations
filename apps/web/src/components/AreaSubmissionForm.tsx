import { getCounties } from "kenya-locations";
import { PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { RecaptchaCheckbox } from "@/components/recaptcha-checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AreaSubmissionFormProps = {
  onSubmit?: (data: { county: string; locality: string; area: string }) => void;
};

export function AreaSubmissionForm({ onSubmit }: AreaSubmissionFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    county: "",
    locality: "",
    area: "",
  });

  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
  const onCaptchaToken = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const counties = getCounties();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!formData.county || !formData.locality || !formData.area) {
      toast.error("Fill in county, locality, and area.");
      return;
    }

    if (!siteKey) {
      toast.error("Captcha is not configured.");
      return;
    }
    if (!captchaToken) {
      toast.error("Complete the captcha.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { submitAreaToNotion } = await import("@/lib/notion");
      await submitAreaToNotion({
        area: formData.area,
        locality: formData.locality,
        county: formData.county,
        captchaToken,
      });
      toast.success("Area submitted.");
      setFormData({ county: "", locality: "", area: "" });
      setCaptchaToken("");
      setOpen(false);
      onSubmit?.(formData);
    } catch (error) {
      console.error("Error submitting area:", error);
      toast.error("Could not submit. Try again, or open a pull request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setCaptchaToken("");
      }}
      open={open}
    >
      <DialogTrigger render={<Button variant="outline" />}>
        <PlusIcon />
        Submit an area
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Submit an area</DialogTitle>
          <DialogDescription>
            Missing estate or neighbourhood? Send it through and we will review
            it against the dataset.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4 px-6 pb-2" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel>County</FieldLabel>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  county: String(value ?? ""),
                }))
              }
              value={formData.county || null}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a county" />
              </SelectTrigger>
              <SelectPopup>
                {counties.map((county) => (
                  <SelectItem key={county.code} value={county.name}>
                    {county.name}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="locality">Locality</FieldLabel>
            <Input
              id="locality"
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  locality: event.target.value,
                }))
              }
              placeholder="Westlands"
              required
              value={formData.locality}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="area">Area</FieldLabel>
            <Input
              id="area"
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, area: event.target.value }))
              }
              placeholder="Gigiri"
              required
              value={formData.area}
            />
          </Field>
          {open && siteKey ? (
            <Field>
              <FieldLabel>Captcha</FieldLabel>
              <RecaptchaCheckbox
                key={open ? "open" : "closed"}
                onTokenChange={onCaptchaToken}
                siteKey={siteKey}
              />
            </Field>
          ) : null}
          {!siteKey ? (
            <p className="text-muted-foreground text-sm">
              Captcha is not configured, so submissions are disabled.
            </p>
          ) : null}
          <DialogFooter className="-mx-6 mt-2" variant="bare">
            <Button
              onClick={() =>
                setFormData({ county: "", locality: "", area: "" })
              }
              type="button"
              variant="ghost"
            >
              Reset
            </Button>
            <Button loading={isSubmitting} type="submit" disabled={!siteKey}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
