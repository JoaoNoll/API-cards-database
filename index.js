const express = require('express');
const database = require('./database');
const server = express();
server.use(express.json());

let nextId = null;

server.get('/',(req,res)=>{
    return res.json({
        result:'Bem vindo ao cadastro de notas!'});
});

async function getNetxId(req, res, next){
    await database.query(`SELECT MAX(id) FROM cards;`,
    {type: database.QueryTypes.SELECT})
    .then(id =>{
        nextId = id[0].max;
        nextId++;
    });
    next();
}

server.post('/notes',getNetxId,async(req,res)=>{
    let addNote;

    const {title,date,hour,content} = req.body;

    await database.query(`INSERT INTO cards VALUES(${nextId},'${title}','${date}','${hour}','${content}');`,
    {type: database.QueryTypes.INSERT}).then(result =>{
        addNote = result;
    })
    .catch(err =>{
        return res.json (err);
    });
    if(addNote[1]){
        return res.json({
            result: 'Nota inserida com sucesso!'
        });
    } else{
        return res.json({
            result:'Não foi possivel inserir a nota!'
        });
    }

})


server.get('/notes',async (req,res)=>{
    let notes;

    await database.query(`SELECT * FROM cards`, {type: database.QueryTypes.SELECT})
    .then(results =>{
        notes = results;
    }). catch (err =>{
        return res.json(notes);
    })

    return res.json({notes});
});

server.get('/notes/:id',async(req,res) =>{
    const {id} = req.params;
    let note;
    await database.query( `SELECT * FROM cards WHERE id = ${id} ` , {type: database.QueryTypes.SELECT})
    .then(results =>{
        note = results;
    }). catch (err =>{
        return res.json(err);
    })
        if(note[0]){
        return res.json({
            result: 'Nota encontrada com sucesso!',
            note: note
        });
    } else{
        return res.json({
            result:'Não foi possivel encontrar a nota!'
        });
    }


})

server.put('/notes/:id',async(req,res)=>{
    const {title,date,hour,content} = req.body;
    const {id} = req.params;

    let atualizar;

    await database.query(`UPDATE cards SET title = '${title}', date = '${date}', hour = '${hour}', content = '${content}' WHERE id = ${id}`, 
    {type: database.QueryTypes.UPDATE})
    .then(results =>{
        atualizar = results;
    }).catch(err => {
        return res.json(err);
    })
    if(atualizar[1]){
        return res.json({
            result: 'Nota atualizada com sucesso!'
        });
    } else{
        return res.json({
            result:'Não foi possivel atualizar'
        });
    }

})

server.delete('/notes/:id',async(req,res) =>{
    const {id} = req.params;
    let deletar;
    await database.query(`DELETE FROM cards WHERE id = ${id}`, 
    {type: database.QueryTypes.DELETE})
    .then(results =>{
        deleter = results;
    }).catch(err =>{
        return res.json(err);
    })
    if(!deletar){
        return res.json({
            result: 'Nota deletada com sucesso'
        });
    } else{
        return res.json({
            result:'Não foi possivel deletar a nota!'
        });
    }


})


server.listen(process.env.PORT);