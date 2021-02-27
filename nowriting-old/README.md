# NoWriting
시각장애인 점자도서 제작 봉사자들을 위한 웹앱

# DataBase
<pre>
CREATE TABLE member (
  mail varchar2(50) PRIMARY KEY,
  pw varchar2(50) NOT NULL,
  name varchar2(30) NOT NULL,
  authkey varchar2(60),
  authstatus number(4) DEFAULT 0,
  signupdate date
);
create table project(
  pId varchar2(50) PRIMARY KEY,
  pName varchar2(100) NOT NULL,
  mail varchar2(50)  ,
  FOREIGN KEY(mail) REFERENCES member(mail) ON DELETE CASCADE
);
create sequence project_seq;

CREATE TABLE content (
  pId varchar2(50),
  content varchar2(4000),
  page varchar2(50),
  PRIMARY KEY(pId,page),
  FOREIGN KEY(pId) REFERENCES project(pId) ON DELETE CASCADE
);
</pre>

