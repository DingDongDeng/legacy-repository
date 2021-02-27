<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>


var contextPath = "${pageContext.request.contextPath}";
var firstDeadDate = ""; //알람요청을 위한 지표 변수
var process;
var priority;
function setFirstDeadDate(){//firstDeadDate 초기화
	let minDate = "";
	const dateList = $(".listPage .list .cover .date");

	let i=0;
	dateList.each(function(index, item){
		let date = $(this).text().trim();
		if(date!=""&& $(this).parent().hasClass("grayBorder")){
			i++;
		}
	});
	if(i==dateList.length){//모든 리스트에 날짜가 존재한다면
		minDate= new Date(document.getElementsByClassName("date")[0].innerHTML);
	}

	dateList.each(function(index, item){

		if($(this).parent().hasClass("grayBorder")){//기한이 진행중인 리스트만 처리
			let date = $(item).text().trim();//리스트의 날짜(기한)
			if(minDate==""&&date!=""){//minDate 값을 초기화
				minDate = new Date(date);
			}
			if(date!=""){//날짜가 존재한다면(날짜가 없을수도 있으니)
				newDate = parseInt(new Date(date).getTime());
				minDate = parseInt(new Date(minDate).getTime());
				if(minDate>newDate){ //날짜의 최소값을 구한다
					minDate = date;
				}
			}
		}
		
	});
	return new Date(minDate);
}



//출처 : https://electronic-moongchi.tistory.com/83
Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";
    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear(); // 년 (4자리)
            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd": return d.getDate().zf(2); // 일 (2자리)
            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default: return $1;
        }
    });
};

String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };

 