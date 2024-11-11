export interface Purchase{
	itemdesc : string,
	itemcategory : string,
	quantity : number,
	estimatedcost : number,
	preferredvendors : undefined | string[],
	justification : string

}

export enum Status{
    PENDING = "Pending",
    FORWARDED = "Forwarded to vendor",
    REJECTED = "Rejected",
	APPROVED = "Approved",
	RECIEVED = "Item recieved",
	CLARIFICATION = "Sent back"

}

export interface Budget{
    yearNo: number;
    equipments: number;
    consumables: number;
    contingency: number;
    travel: number;
    manpower: number;
    overhead: number;
};
export interface pdf{
	name :string,
	url : string
}

export interface statusp{
	status : Status,
	by : string | undefined,
	date : Date
}

export interface Project {
	projectname : string,
	projectid : string,
	projectduration : number,
	projectgrantno : number,
	faculty : string,
	facultydept : string
	facultyemail : string,
    facultyphone : number,
	projectcategory : string,
	totalcost : number,
	purchases : Purchase[],
	budget : Budget[],
	documents : pdf[] | undefined,
	status : statusp,
	statushist : statusp[],
	remarks : string | undefined
}
