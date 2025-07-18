import { isSingletonMode } from "@/lib/conn";
import { Tag } from "@douyinfe/semi-ui";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

export const Singleton: FC = () => {
	const { t } = useTranslation("common");
	if (!isSingletonMode()) {
		return <></>;
	}
	return <Tag size="small">{t("singleton_mode")}</Tag>;
};
