package com.dev.nowriting.dto;

public class ProjectDTO {
	private String pId;
	private String pName;
	private String id;
	
	public ProjectDTO() {
		
	}
	
	public ProjectDTO(String pId, String pName, String id) {
		super();
		this.pId = pId;
		this.pName = pName;
		this.id = id;
	}
	public String getpId() {
		return pId;
	}
	public void setpId(String pId) {
		this.pId = pId;
	}
	public String getpName() {
		return pName;
	}
	public void setpName(String pName) {
		this.pName = pName;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	
	

}
