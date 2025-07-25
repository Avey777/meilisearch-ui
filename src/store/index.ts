import { produce } from "immer";
import _ from "lodash";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SUPPORTED_LANGUAGE } from "@/lib/i18n";

const defaultLanguage: SUPPORTED_LANGUAGE = "en";

export interface WarningPageData {
	prompt: string;
}

export interface Instance {
	id: number;
	name: string;
	host: string;
	apiKey?: string;
	updatedTime?: Date;
}

export const defaultInstance: Omit<Instance, "id"> = {
	name: "default",
	host: "http://127.0.0.1:7700",
	apiKey: undefined,
};

interface State {
	warningPageData?: WarningPageData;
	instances: Instance[];
	language: SUPPORTED_LANGUAGE;
	setWarningPageData: (data?: WarningPageData) => void;
	addInstance: (cfg: Omit<Instance, "updatedTime" | "id">) => void;
	editInstance: (id: number, cfg: Omit<Instance, "updatedTime" | "id">) => void;
	removeInstance: (id: number) => void;
	removeAllInstances: () => void;
	setLanguage: (lang: SUPPORTED_LANGUAGE) => void;
}

export const useAppStore = create<State>()(
	devtools(
		persist(
			(set, get) => ({
				instances: [],
				language: defaultLanguage,
				setWarningPageData: (data?: WarningPageData) =>
					set(
						produce((state: State) => {
							state.warningPageData = data;
						}),
					),
				addInstance: (cfg) =>
					set(
						produce((state: State) => {
							state.instances.push({
								...cfg,
								updatedTime: new Date(),
								// calculate next ins id
								// start from 1, id 0 is reserved for singleton mode
								id: (_.maxBy(get().instances, "id")?.id || 0) + 1,
							});
						}),
					),
				editInstance: (id, cfg) =>
					set(
						produce((state: State) => {
							const index = state.instances.findIndex((i) => i.id === id);
							if (index !== -1)
								state.instances[index] = {
									...cfg,
									id,
									updatedTime: new Date(),
								};
						}),
					),
				removeInstance: (id) =>
					set(
						produce((state: State) => {
							const index = state.instances.findIndex((i) => i.id === id);
							if (index !== -1) state.instances.splice(index, 1);
						}),
					),
				removeAllInstances: () =>
					set(
						produce((state: State) => {
							state.instances = [];
						}),
					),
				setLanguage: (lang) =>
					set(
						produce((state: State) => {
							state.language = lang;
						}),
					),
			}),
			{
				name: "meilisearch-ui-store",
				version: 5,
			},
		),
	),
);
