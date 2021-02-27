package com.dev.nowriting.dao.jdbcTemplate;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import com.dev.nowriting.dto.ContentDTO;
import com.dev.nowriting.dto.ProjectDTO;

@Repository
public class MainDAOImpl implements MainDAO {
	
	@Autowired
	JdbcTemplate template;
	
	@Override
	public void insertProject(final String projectName, final String mail) {
		
		template.update(new PreparedStatementCreator() {
			
			@Override
			public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
				
				String query = "insert into project (pId, pName, mail) values(project_seq.nextval,?,?)";
				PreparedStatement pstmt = con.prepareStatement(query);
				pstmt.setString(1, projectName);
				pstmt.setString(2, mail);

				
				return pstmt;
				
			}
		});
	}

	public ArrayList<ProjectDTO> getProjectList(String mail) {

		String query = "select pId, pName, mail from project where mail= '" +mail+"'"+
						" order by pName asc";
		return (ArrayList<ProjectDTO>) template.query(query, new BeanPropertyRowMapper<ProjectDTO>(ProjectDTO.class));
	}
	
	public void deleteProject(final String mail, final String pId, final String pName) {
		String query = "delete from project where mail= ? and pId=? and pName= ?";
		template.update(query, new PreparedStatementSetter(){

			@Override
			public void setValues(PreparedStatement ps ) throws SQLException{
				ps.setString(1,mail);
				ps.setString(2, pId);
				ps.setString(3, pName);
			}

		});
		
		
	}
	public int contentCnt(String pId, String page){
		String query = "select count(pId) from content where pId='"+pId+"' and page='"+page+"'";
		Integer contentCnt =template.queryForObject(query,Integer.class);
		return contentCnt;
	}
	
	public void insertContent(final String pId, final String page, final String content) {
		template.update(new PreparedStatementCreator() {
			
			@Override
			public PreparedStatement createPreparedStatement(Connection con) throws SQLException {

				String query = "insert into content (pId, page, content) values(?,?,?)";
				PreparedStatement pstmt = con.prepareStatement(query);
				pstmt.setString(1, pId);
				pstmt.setString(2, page);
				pstmt.setString(3, content);

				return pstmt;
			}
		});
	}
	public void updateContent(final String pId, final String page, final String content) {
		String query = "update content set content = ? where pId = ? and page = ?";
		template.update(query, new PreparedStatementSetter(){

			@Override
			public void setValues(PreparedStatement ps) throws SQLException{
				ps.setString(1, content);
				ps.setString(2, pId);
				ps.setString(3, page);
			}

		});
	}
	
	public ArrayList<ContentDTO> findContentMaxPage(String pId){
		String query = "select * from content where pId='"+pId+"' and page=(select Max(TO_NUMBER(page)) from content where pId='"+pId+"')";
		return (ArrayList<ContentDTO>) template.query(query, new BeanPropertyRowMapper<ContentDTO>(ContentDTO.class));
	}
	
	public ArrayList<ContentDTO> findContentPage(String pId, String page){
		String query = "select * from content where pId='"+pId+"' and page='"+page+"'";
		return (ArrayList<ContentDTO>) template.query(query, new BeanPropertyRowMapper<ContentDTO>(ContentDTO.class));
	}
	
	public void deleteContentPage(final String pId, final String page) {
		
		String query = "delete from content where pId=? and page=?";
		template.update(query, new PreparedStatementSetter(){

			@Override
			public void setValues(PreparedStatement ps ) throws SQLException{
				ps.setString(1,pId);
				ps.setString(2, page);	
			}
		});
	}
	public ArrayList<ContentDTO> getContentList(String pId){
		String query = "select * from content where pId='"+pId +"' "+ 
					   " order by TO_NUMBER(page) asc";
		return (ArrayList<ContentDTO>) template.query(query, new BeanPropertyRowMapper<ContentDTO>(ContentDTO.class));
	}
	
	

}
