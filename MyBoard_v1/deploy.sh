
REPOSITORY=/home/ec2-user/app/MyBoard_v1
PROJECT_NAME=MyBoard_v1
WAR_NAME=portfolio-0.0.1-SNAPSHOT.war

cd $REPOSITORY/$PROJECT_NAME/

echo "> Git pull"
git pull

echo "> Maven Build(package no test)"
mvn package -Dmaven.test.skip=true

echo "> move repository"
cd $REPOSITORY

echo "현재 구동중인 애플리케이션 pid 확인"
#CURRENT_PID=$(pgrep -f ${PROJECT_NAME}*.war)
CURRENT_PID=$(pgrep -f java)


echo "현재 구동중인 애플리케이션 pid: $CURRENT_PID"
if [ -z "$CURRENT_PID" ]; then
  echo "> 현재 구동 중인 애플리케이션이 없으므로 종료하지 않습니다."
else
  echo "> kill -15 $CURRENT_PID"
  kill -15 $CURRENT_PID
  sleep 5
fi

echo "> application run"
cd $REPOSITORY/$PROJECT_NAME/
nohup java -jar target/portfolio-0.0.1-SNAPSHOT.war &
