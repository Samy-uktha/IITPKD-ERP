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
    ACCEPTED = "Accepted",
    REJECTED = "Rejected",
	APPROVED = "approved by vendor",
	RECIEVED = "Item recieved"

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

export interface Project {
	projectname : string,
	projectid : string,
	projectduration : number,
	projectgrantno : number,
	faculty : string,
	projectcategory : string,
	totalcost : number,
	purchases : Purchase[],
	budget : Budget[]
}
