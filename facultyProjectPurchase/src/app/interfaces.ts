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
	fileURL: string
}

export interface Document {
	documentName: string;
	documentURL: string;
}

