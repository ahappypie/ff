const fs = require('fs')

module.exports = function(entity, seasonId, data, week) {
    const file = process.env.LEAGUE_ID + '.json'
    const path = `warehouse/raw/${entity}/season=${seasonId}/` + (week ? `week=${week}/`: '')

    !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true })

    fs.writeFileSync(path + file, data)
}