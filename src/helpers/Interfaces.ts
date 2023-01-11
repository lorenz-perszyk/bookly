interface Image {
	smallThumbnail: string;
	thumbnail: string;
}

export interface CurrentBook {
	title: string;
	author: string[];
	pageCount?: number;
	published?: string;
	description?: string;
}

export interface IBookshelf {
	title: string;
	author: string[];
	pageCount?: number;
	published?: string;
	description?: string;
	nodeRef?: any;
}

export interface IVolumeInfo {
	title?: string;
	author?: string[];
	pageCount?: number;
	published?: string;
	description?: string;
}

export interface IResults {
	title: string;
	author: string[];
	pageCount: number;
	published: string;
	length: number;
}

export interface IGetBooks {
	keyword: string;
	category: string;
	pageMin: string;
	pageMax: string;
	releaseMin: string;
	releaseMax: string;
}

export interface INotifications {
	id: string,
	type: string,
	icon: string,
	message: string,
	color: string,
}
