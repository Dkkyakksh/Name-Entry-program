const mysql = require('mysql2');
const dotenv = require('dotenv');
const util  = require('util');

let instance = null;

dotenv.config();

const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

conn.connect((err)=>{
    if(err) throw err;
});

conn.on('connect', ()=>{
    console.log("Connected\n");
})
conn.on('end', ()=>{
    console.log("Disconnected\n");
})
conn.on('error', (err)=>{
    console.log(err);
})

class dbService{
    static getdbserviceinstance() {
        return instance ? instance : new dbService();
    }
    
    async getAllData(){
        try{
            const response = await new Promise((resolve,reject)=>{
                const quer = "SELECT * FROM names"; 
                conn.query(quer, (err,results)=>{
                    if(err) reject(console.log(err));
                    resolve(results);
                })
            }); 
            
            // console.log(response);
            return response;
        }catch(err){
            console.log(err);
        }
    }

    async insertNewName(name){
        try{
            const dateAdded = new Date();
            const insertID = await new Promise((resolve, reject)=>{
                const quer = "INSERT INTO names (Name, date_added) VALUES (?,?);";
                conn.query(quer, [name, dateAdded], (err, result)=>{
                    if(err) reject(console.log(err));
                    resolve(result.insertId);
                })
            });
            return{
                id: insertID,
                Name: name,
                date_added: dateAdded
            }
        }catch(err){
            console.log(err);
        }
    }
    async deleteRowById(id){
        try{
            id = parseInt (id, 10);//this is radix base 10 and is optional
            //                      it specifies the numbering system used in the string
            // it is base 10 by default
            const response = await new Promise((resolve, reject)=>{
                const quer = "DELETE FROM names WHERE id = ?;";
                conn.query(quer, [id], (err, result)=>{
                    if(err) reject(console.log(err));
                    resolve(result.affectedRows);
                })
            }); 
            return response === 1 ? true : false;
        } catch(err){
            console.log(err);
            return false;
        }   
    }
    
    async updateNameById(id, Name){
        try{
            id = parseInt (id, 10);//this is radix base 10 and is optional
            //                      it specifies the numbering system used in the string
            // it is base 10 by default
            const response = await new Promise((resolve, reject)=>{
                const quer = "UPDATE names SET Name = ? WHERE id = ?;";
                conn.query(quer, [Name, id], (err, result)=>{
                    if(err) reject(console.log(err));
                    resolve(result.affectedRows);
                })
            }); 
            // console.log(response);
            return response === 1? true: false;
        } catch(err){
            console.log(err);
            return false;
        }   
    }

    async searchByName(Name){
        try{
            const response = await new Promise((resolve,reject)=>{
                const quer = "SELECT * FROM names WHERE Name = ?"; 
                conn.query(quer, [Name],(err,results)=>{
                    if(err) reject(console.log(err));
                    resolve(results);
                })
            }); 

            // console.log(response);
            return response;
        }catch(err){
            console.log(err);
        }

    }
    
}

module.exports = dbService;