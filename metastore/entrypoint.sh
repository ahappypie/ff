#!/bin/sh

export HADOOP_HOME=/opt/hadoop-3.3.2
export HADOOP_CLASSPATH=${HADOOP_HOME}/share/hadoop/tools/lib/aws-java-sdk-bundle-1.11.375.jar:${HADOOP_HOME}/share/hadoop/tools/lib/hadoop-aws-3.3.2.jar

/opt/apache-hive-metastore-3.0.0-bin/bin/schematool -initSchema -dbType postgres
/opt/apache-hive-metastore-3.0.0-bin/bin/start-metastore