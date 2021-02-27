<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<style>
	
		.img{
			width: 80%;
			margin-left : auto;
			margin-right : auto;
		}
		#img1{
			margin-top : 10px;
			display:inline-block;
			width : 50px;
			height : 50px;	
			background: url("${pageContext.request.contextPath}/resources/img/right-arrow.png" ) no-repeat;
		}
		#img2{
			margin-top : 10px;
			display:inline-block;
			width : 50px;
			height : 50px;
			background: url("${pageContext.request.contextPath}/resources/img/photo.png" ) no-repeat;
		}
		#img3{
			margin-top : 10px;
			display:inline-block;
			width : 50px;
			height : 50px;
			background: url("${pageContext.request.contextPath}/resources/img/save.png" ) no-repeat;
		}
		#img4{
			margin-top : 10px;
			display:inline-block;
			width : 126px;
			height : 53px;
			background: url("${pageContext.request.contextPath}/resources/img/content_explain_1.png" ) no-repeat;
		}
		#img5{
			margin-top : 10px;
			display:inline-block;
			width : 50px;
			height : 50px;
			background: url("${pageContext.request.contextPath}/resources/img/delete.png" ) no-repeat;
		}
	</style>
</head>
<body>
	 <div class="content">
	 	<div class="title">
	 		<h3>사용법</h3>
	 	</div>
		<div  class="img">
			<div>
				<div id="img1"></div>
				<div>· 다음페이지 또는 이전페이지로 이동합니다.</div> 
			</div>
			<div>
				<div id="img2"></div> 
				<div>· 사진을 촬영하여 텍스트를 추출하거나, 기존 이미지파일에서 텍스트를 추출합니다.(사진촬영의 경우 기기에 카메라가 있어야함)</div>
			</div>
			<div>
				<div id="img3"></div> 
				<div>· 현재 페이지의 내용을 저장합니다.</div>
			</div>
			<div>
				<div id="img4"></div> 
				<div>· 입력한 페이지로 이동합니다.</div>
			</div>
			<div>
				<div id="img5"></div> 
				<div>· 현재 페이지를 삭제합니다.</div>
			</div>
			</br>
			</br>
			<h3>핸드폰 카메라와 데스크탑(PC)으로 작업하기</h3>
			해당작업은 핸드폰 카메라로 사진촬영후 해당 이미지의 텍스트를 PC로 전송하는 방법입니다.
			<p>* PC</p>
			<p>(1)작업유형을 PC로 설정하고, 계정에 로그인합니다</p>
			<p>(2)작업할 프로젝트를 더블클릭하여 페이지 편집화면을 띄웁니다.</p>
			<p>(3)텍스트를 전송받길 원하는 페이지로 이동합니다.</p>
			<p>* 핸드폰</p>
			<p>(1)작업유형을 카메라촬영으로 설정하고, 계정에 로그인합니다.</p>
			<p>(2)카메라 버튼을 눌러 촬영, 또는 기존 이미지를 선택합니다.</p>
			<p> 문제가 없다면 PC에 이미지의 텍스트들이 추출되어 표시됩니다. </p>
		</div>
	</div>	
</body>
</html>
