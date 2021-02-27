package com.dev.nowriting.dto;

public class ContentDTO {
	
	private String pId;
	private String content;
	private String page;
	
	public ContentDTO() {
		
	}
	public ContentDTO(String pId, String content, String page) {
		super();
		this.pId = pId;
		this.content = content;
		this.page = page;
	}
	public String getpId() {
		return pId;
	}
	public void setpId(String pId) {
		this.pId = pId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getPage() {
		return page;
	}
	public void setPage(String page) {
		this.page = page;
	}
}


