import org.apache.spark.sql.functions.{collect_list, struct}

object Main extends SparkSessionWrapper {
  def main(args: Array[String]): Unit = {
    val rawDataPath = dataPath + "raw/"
    val bucket = "s3a://fantasy/nfl/"

    import spark.implicits._

    val rawPlayers = spark.read.json(rawDataPath + "players")

    val players = rawPlayers
      .select($"playerId".as("id"), $"name", $"defaultPosition".as("position"))
      .distinct()
      .orderBy($"name".asc)
    //    players.show(false)
    players.write.format("delta")
      .mode(org.apache.spark.sql.SaveMode.Overwrite)
      .option("path", bucket + "players")
      .saveAsTable("players")

    val rawStatus = spark.read.json(rawDataPath + "playerstatuses").distinct()
    //    rawStatus.show(false)

    val rawStats = spark.read.json(rawDataPath + "stats")

    val weeklyStatsByPlayer = rawStats
      .filter($"number" !== 0)
      .groupBy($"playerId", $"season", $"week")
      .agg(collect_list(struct($"stat", $"number".as("value"))).as("stats"))
      .orderBy($"season".asc, $"week".asc, $"playerId".asc)
    //    weeklyStatsByPlayer.show(false)

    val rawProjections = spark.read.json(rawDataPath + "projections")

    val weeklyProjectionsByPlayer = rawProjections
      .filter($"number" !== 0)
      .groupBy($"playerId", $"season", $"week")
      .agg(collect_list(struct($"stat", $"number".as("value"))).as("stats"))
      .orderBy($"season".asc, $"week".asc, $"playerId".asc)
    //    weeklyProjectionsByPlayer.show(false)

    val weeklyPlayers = rawStatus
      .join(weeklyStatsByPlayer, rawStatus("playerId") === weeklyStatsByPlayer("playerId")
        && rawStatus("season") === weeklyStatsByPlayer("season")
        && rawStatus("week") === weeklyStatsByPlayer("week"))
      .join(weeklyProjectionsByPlayer, rawStatus("playerId") === weeklyProjectionsByPlayer("playerId")
        && rawStatus("season") === weeklyProjectionsByPlayer("season")
        && rawStatus("week") === weeklyProjectionsByPlayer("week"))
      .select(rawStatus("playerId"), rawStatus("season"), rawStatus("week"), rawStatus("teamId").as("nflTeam"),
        rawStatus("availability"), rawStatus("injuryStatus"), weeklyStatsByPlayer("stats"),
        weeklyProjectionsByPlayer("stats").as("projections"))
      .orderBy($"season".asc, $"week".asc, $"playerId".asc)

    //    weeklyPlayers.show(false)
    weeklyPlayers.write.format("delta")
      .mode(org.apache.spark.sql.SaveMode.Overwrite)
      .option("path", bucket + "weekly")
      .saveAsTable("weekly")

    val rawTeams = spark.read.json(rawDataPath + "teams")
    rawTeams.write.format("delta")
      .mode(org.apache.spark.sql.SaveMode.Overwrite)
      .option("path", bucket + "teams")
      .saveAsTable("teams")
  }
}
