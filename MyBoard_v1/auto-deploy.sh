
REPOSITORY=/home/ec2-user/app/MyBoard_v1
ZIP=zip
PROJECT_NAME=MyBoard_v1
WAR_NAME=portfolio-0.0.1-SNAPSHOT.war

echo "> git pull"
git pull

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
cp -rf $REPOSITORY/$PROJECT_NAME/src/main/resources/properties/private $REPOSITORY/$ZIP/$PROJECT_NAME/src/main/properties
cd $REPOSITORY/$ZIP/$PROJECT_NAME
chmod +x ./mvnw
./mvnw clean package -Dmaven.test.skip=true
cd $REPOSITORY/$PROJECT_NAME
chmod +x ../$ZIP/$PROJECT_NAME/target/$WAR_NAME
nohup java -jar ../$ZIP/$PROJECT_NAME/target/$WAR_NAME > $REPOSITORY/nohup.out 2>&1 &
echo "> fin"

