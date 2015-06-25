// Definición del modelo de Comments con validacion

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Comment',
		{ texto: {
			type:	DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Falta Comentario"}}
			},
		  publicado: {
			  type: DataTypes.BOOLEAN,
			  defaultValue: false
			}
		},
		{ classMethods: {
				countUnpublished: function () {
					//Comentario no publicados
					return this.count({where: {publicado: 'false'}}).then('success', function(count) {
					//return this.aggregate('QuizId', 'count', { distinct: false }).then('success', function(count) {
						return count;
					})
				},
				countCommentedQuizes: function () {
					//Preguntas con comentario
					return this.aggregate('QuizId', 'count', { distinct: true }).then('success', function(count) {
						return count;
					})
				}
			}
		});
}
