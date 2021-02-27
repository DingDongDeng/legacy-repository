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

import com.dev.nowriting.dto.MemberDTO;

@Repository
public class MemberDAOImpl implements MemberDAO {
	
	@Autowired
	JdbcTemplate template;
	@Override
	public ArrayList<MemberDTO> findID(String id){
		String query = "SELECT * FROM MEMBER WHERE ID = '"+id+"'";
		return (ArrayList<MemberDTO>) template.query(query, new BeanPropertyRowMapper<MemberDTO>(MemberDTO.class));
	}
	public ArrayList<MemberDTO> findMail(String mail){
		String query = "SELECT * FROM MEMBER WHERE MAIL = '"+mail+"'";
		return (ArrayList<MemberDTO>) template.query(query, new BeanPropertyRowMapper<MemberDTO>(MemberDTO.class));
	}
	
	@Override
	public void insertMember(final MemberDTO dto) {
		
		template.update(new PreparedStatementCreator() {
			
			@Override
			public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
				
				String query = "insert into member (mail, pw, name, authkey, authstatus) values(?,?,?,?,?)";
				PreparedStatement pstmt = con.prepareStatement(query);
				pstmt.setString(1, dto.getMail());
				pstmt.setString(2, dto.getPw());
				pstmt.setString(3, dto.getName());
				pstmt.setString(4, dto.getAuthkey());
				pstmt.setInt(5, dto.getAuthstatus());

				return pstmt;
				
			}
		});
	}
	@Override
	public void updateAuthStatus(final String id,  final String authKey) {
		String query ="update member set authstatus=1 where id=? and authkey=?";
		
		template.update(query, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException{
				ps.setString(1, id);
				ps.setString(2, authKey);
			}
		});
	}
	

}











