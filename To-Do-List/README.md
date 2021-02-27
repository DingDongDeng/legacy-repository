# To-Do-List
## 소개
할일 목록을 관리 할 수 있는 To Do List 웹<br>
목록의 우선순위 관리, 기한 관리, 실시간 알람 등의 서비스 제공

실제 url:<br>
http://ec2-13-209-0-6.ap-northeast-2.compute.amazonaws.com/todolist

**회원가입시 메일인증이 필요합니다.</br>
예기치 못한 오류가 발생하여 메일인증이 불가할시 id: admin / pw: 1234 를 이용해주세요.**

## 개발도구, 환경 및 기술스택
eclipse -jee(sts)</br>
Tomcat 8.0</br>
jdk 1.8</br>

Spring 4.3.4.RELEASE</br>
Oracle11g</br>
mybatis</br>

jsp</br>
html</br>
JQuery</br>
javascript</br>
CSS</br>

aws ec2</br>
aws rds(oracle)</br>


## 서버(aws ec2 ubuntu)
+++ 현 프로젝트에서는 mail 인증 기능으로 인해 587port 를 사용 할수 있어야함.**</br>

**자바8 설치**</br>
sudo add-apt-repository ppa:webupd8team/java</br>
sudo apt-get update</br>
sudo apt-get install openjdk-8-jdk</br>

**자바 환경변수 설정**</br>
sudo vi /etc/profile ------> export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 </br>

**apache2 설치**</br>
sudo apt-get install apache2</br>
sudo service apache2 start</br>

**tomcat8 설치**</br>
sudo apt-get install tomcat8</br>
sudo service tomcat8 start</br>

**libapache2-mod-jk 설치**</br>
sudo apt-get install libapache2-mod-jk</br>
sudo vi /etc/libapache2-mod-jk/workers.properties</br>
---->  "workers.tomcat_home = /usr/share/tomcat8" 로 변경</br>
"workers.java_home = /usr/lib/jvm/java-8-openjdk-amd64"</br>
                                                           
**톰캣 설정 변경**</br>
sudo vi /etc/tomcat8/server.xml   </br>
아래내용의 주석을 해제</br>
	<!-- Define an AJP1.3 Connector on port 8009 --></br>
	<Connector port=“8009” protocol=“AJP/1.3” redirectPort=“8443”/></br>
  
**사용할 톰캣 포트 설정**</br>
	<Connector port=“8181” protocol=“HTTP/1.1”  //port를 8181로 설정</br>
			connectionTimeout=“20000”</br>
			URIEncoding=“UTF-8”  </br>
			redirectPort=“8443”/></br>

**AJP 모듈 활성화**</br>
	sudo a2enmod proxy_ajp</br>
	sudo service apache2 restart</br>
    
**apache 설정 변경**</br>
	sudo vi /etc/apache2/sites-available/000-default.conf</br>
		"DocumentRoot /var/www/html" 아래에  “JkMount /* ajp13_worker” 라는 내용을 추가</br>
	sudo service tomcat8 restart</br>
	sudo service apache2 restart</br>

## 데이터베이스 (aws rds oracle)

CREATE TABLE member (</br>
  mail varchar2(50) PRIMARY KEY,</br>
  password varchar2(50) NOT NULL,</br>
  authkey varchar2(60),</br>
  authstatus number(4) DEFAULT 0,</br>
  signupdate date</br>
);</br>

CREATE TABLE todolist(</br>
  mail varchar2(50),</br>
  priority number,</br>
  title varchar2(200) not null,</br>
  deadline date null ,</br>
  content varchar2(800) not null,</br>
  state varchar(10) check(state in('R','C')) ,  /* R : Running 진행중, C : Completed 완료 */</br>

  PRIMARY KEY(mail, priority),</br>
  FOREIGN KEY(mail) REFERENCES member(mail) ON DELETE CASCADE</br>
);</br>


## 배포방법
**tomcat manager 설치**</br>
sudo apt-get install tomcat8-admin</br>
sudo vi /etc/tomcat8/tomcat-users.xml  //권한을 할당해주는 과정</br>
\<role rolename=“manager-script”/>\
\<role rolename=“manager-gui”/>\
\<role rolename=“manager-jmx”/>\
\<role rolename=“manager-status”/>\
<user usename=“관리자계정명” password=“비밀번호” </br>
roles=“manager-gui,manager-script,manager-status,manager-jmx/></br>
sudo service tomcat8 start</br>
  
이후에  주소:포트/manager 로 접속한뒤 프로젝트.war파일로 배포</br>
**+++ jdbc 드라이버를 찾지 못할 경우 /usr/share/tomcat8/lib 경로에 직접 jdbc.jar 파일을 업로드 한다.(ftp 활용)</br>
