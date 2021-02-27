package com.programmers.todolist.dto;

import java.sql.Timestamp;

public class ListDTO {
	private String mail;
	private int priority;
	private String title;
	private Timestamp deadline;
	private String content;
	private String state;
	
	public ListDTO() {
		
	}
	public ListDTO(String mail, int priority, String title, Timestamp deadline, String content, String state) {
		super();
		this.mail = mail;
		this.priority = priority;
		this.title = title;
		this.deadline = deadline;
		this.content = content;
		this.state = state;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public int getPriority() {
		return priority;
	}
	public void setPriority(int priority) {
		this.priority = priority;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Timestamp getDeadline() {
		return deadline;
	}
	public void setDeadline(Timestamp deadline) {
		this.deadline = deadline;
	}
	public void setDeadline(String deadline) {
		long l = Long.parseLong(deadline);
		this.deadline = new Timestamp(l);
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	
}
