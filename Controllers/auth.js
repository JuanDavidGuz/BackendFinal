const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = express.request ) => {
   const { name, email, password } = req.body;
   try{
    let usuario = await Usuario.findOne({ email: email });
    if(usuario){
        return res.status(400).json({
            ok: false,
            msg: 'Un usuario existe con ese correo'
        });
    }
    usuario = new Usuario(req.body);
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();

    res.status(200).json({
        ok: true,
        usuario,
       }); 
   }catch(error){
    console.log(error)
    res.status(500).json({
        ok: false,
        error
    })
   }    

   
}

const loginUsuario = async(req, res = express.request ) => {
    const { email, password } = req.body;
    try{
        let usuario = await Usuario.findOne({ email: email });
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        const token = await generarJWT(usuario.id, usuario.name);
        // Generar JWT
        res.status(200).json({
            ok: true,
            usuario,
            token
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            error
        })
    }
}

 const revalidarToken = async(req, res = express.request ) => {
    const { uid, name } = req;
    // Generar un nuevo JWT y retornarlo en esta petición
    const token = await generarJWT(uid, name);
    res.json({
        ok: true,
        token
    }); 
}

module.exports = {
    loginUsuario,
    crearUsuario,
    revalidarToken
}