export interface Project {
	name: string;
	category: string;
	id: string;
	grant: string;
	duration: string;
	budget: number;
	description: string;
  }

export interface Equipment {
	name: string;
	specs: string;
	quantity: number;
	justification: string;
	equipDoc: Document;
	equipDocURL: URL;
}

export interface Document {
	document: Document;
	documentURL: URL;
}

