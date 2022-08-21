import org.apache.spark.sql.SparkSession

trait SparkSessionWrapper extends Serializable {
  val dataPath = System.getProperty("user.home") + "/ff/warehouse/"

  lazy val spark = SparkSession.builder()
    .appName("ff-spark")
    .master("local")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.databricks.delta.retentionDurationCheck.enabled", false)
    .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    .config("spark.hadoop.fs.s3a.path.style.access", true)
    .config("spark.hadoop.fs.s3a.access.key", sys.env.getOrElse("AWS_ACCESS_KEY", "minio"))
    .config("spark.hadoop.fs.s3a.secret.key", sys.env.getOrElse("AWS_SECRET_KEY", "minio123"))
    .config("spark.hadoop.fs.s3a.endpoint", sys.env.getOrElse("S3_ENDPOINT", "http://localhost:9000"))
//    .config("spark.sql.warehouse.dir", dataPath)
//    .config("hive.metastore.uris", "thrift://localhost:9083")
//    .enableHiveSupport()
    .getOrCreate()
}