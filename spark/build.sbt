scalaVersion := "2.13.8"

lazy val sparkVersion = "3.3.0"
lazy val hadoopVersion = "3.3.2"
lazy val deltaVersion = "2.1.0rc1"

resolvers += "Delta" at "https://oss.sonatype.org/content/repositories/iodelta-1087/"

libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-sql" % sparkVersion % "provided",
  "org.apache.spark" %% "spark-hive" % sparkVersion % "provided",
  "org.apache.hadoop" % "hadoop-aws" % hadoopVersion % "provided",
  "io.delta" %% "delta-core" % deltaVersion % "provided"
)

// include the 'provided' Spark dependency on the classpath for `sbt run`
Compile / run := Defaults.runTask(Compile / fullClasspath, Compile / run / mainClass, Compile / run / runner).evaluated