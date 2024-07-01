import redis from "~/utils/connection";
import { FormModule } from "../types/module";
import { PageMetaData } from "../types/pagemeta";

export const getModule = async (moduleId: string) => {};

export const getPagesData = async (moduleId: string, userId: string) => {};

export const getPageData = async (
	moduleId: string,
	userId: string,
	pageId: number
) => {};

export const saveModule = async (module: FormModule) => {};

export const savePageData = async (pageData: PageMetaData) => {};

export const savePagesData = async (pagesData: PageMetaData[]) => {};
