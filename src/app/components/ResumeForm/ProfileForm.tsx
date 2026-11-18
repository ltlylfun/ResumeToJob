"use client";
import { useRef } from "react";
import { BaseForm } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeManagerSlice";
import { ResumeProfile } from "lib/redux/types";
import { CameraIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const t = useTranslations("resumeForm.profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { name, email, phone, url, summary, location, photoUrl, photoSize } = profile;
  const form = "profile";
  const handleProfileChange = (
    field: keyof ResumeProfile,
    value: string | string[] | number,
  ) => {
    dispatch(changeProfile({ field, value: value as any }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleProfileChange("photoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    handleProfileChange("photoUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label={t("name")}
          labelClassName="col-span-full"
          name="name"
          placeholder=""
          value={name}
          onChange={handleProfileChange}
        />{" "}
        <div className="col-span-full">
          <BulletListTextarea
            label={t("summary")}
            name="summary"
            placeholder={t("summaryPlaceholder")}
            value={summary}
            onChange={handleProfileChange}
          />
        </div>
        <Input
          label={t("email")}
          labelClassName="col-span-4"
          name="email"
          placeholder={t("checkCarefully")}
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label={t("phone")}
          labelClassName="col-span-2"
          name="phone"
          placeholder={t("checkCarefully")}
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label={t("website")}
          labelClassName="col-span-4"
          name="url"
          placeholder={t("websiteExample")}
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label={t("location")}
          labelClassName="col-span-2"
          name="location"
          placeholder=""
          value={location}
          onChange={handleProfileChange}
        />
        <div className="col-span-full">
          <label className="mb-1 block text-sm font-medium">{t("photo")}</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    className="rounded-md object-cover"
                    alt={t("personalPhoto")}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <CameraIcon className="h-8 w-8" />
                )}
              </label>
              {photoUrl && (
                <button
                  type="button"
                  className="absolute -right-2 -top-2 rounded-full bg-white text-gray-500 hover:text-gray-700"
                  onClick={handleRemovePhoto}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>{t("uploadProfessionalPhoto")}</p>
            </div>
            {photoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <label htmlFor="photo-size" className="text-sm font-medium">
                  {t("photoSize")}
                </label>
                <input
                  id="photo-size"
                  type="range"
                  min={40}
                  max={160}
                  step={5}
                  value={photoSize ?? 80}
                  onChange={(e) =>
                    handleProfileChange("photoSize", Number(e.target.value))
                  }
                  className="w-40"
                />
                <span className="text-sm text-gray-500">{photoSize ?? 80}</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </BaseForm>
  );
};
