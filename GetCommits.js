import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import axios from 'axios';

function GetCommits(){

    const {owner,repository,oid}=useParams();
    const url=`http://localhost:8081/repos/${owner}/${repository}/commits/${oid}`;

    var [commits, setGetCommits] = useState([]);
    var [days,setDays] = useState();
    var [parentid,setParentid] = useState();
    var [commitedby,setCommittedby] = useState();
    var [authorname,setAuthorname] = useState();
    var [authorphoto,setAuthorphoto] = useState();

    useEffect( () => {
        axios.get(`https://api.github.com/users/${owner}`)
        .then(() =>{
            axios.get(`https://api.github.com/repos/${owner}/${repository}`)
            .then(() => {
                newFunction()
                .catch((error)=>{
                    alert("Incorrect Oid for the given User's Repository");
                    setGetCommits("Incorrect Oid for the given User's Repository")
                });
            })
            .catch((error) => {
                alert("Ivalid Repository for the given User")
                setGetCommits("Ivalid Repository for the given User")
                // alert("Repository "+error.message)
            })
        
        })
        .catch((error) => {
            alert("Invalid user")
            setGetCommits("Invalid user")
            // alert("Invalid User ["+ error.message + "]")
        })

    },[url,oid,owner,parentid,repository])

    return(
        <div className ="center">
        <>
            <div className="left">

                <div className="left">
                    <img src={authorphoto} alt="Avatar" className="image">
                    </img>
                </div>

                <div className="left">
                    <p><span className="body-text">{authorname}</span></p>
                </div>

            </div>

            <div className="right">
                <p><span className="muted">Commited by </span><span className="body">{commitedby} </span><span className="muted">{days} days ago</span></p>
                <p><span className="muted">Parent </span><span className="Link-monospace">{parentid}</span></p>
                <p><span className="muted">Commit </span><span className="body">{oid}</span></p>
            </div>

        </>

        <>

            <article>
                <pre>
                    {JSON.stringify(commits)}
                </pre>
            </article>
            
        </>

    </div>
    )

    function newFunction() {
        return axios.get(url)
            .then((json) => {
                var currdate = new Date();
                setDays(Math.floor((currdate - Date.parse(json.data.commit.committer.date)) / (1000 * 3600 * 24)));
                setAuthorname(json.data.commit.author.name);
                setCommittedby(json.data.commit.committer.name);
                setParentid(json.data.parents[0].sha);
                setAuthorphoto(json.data.author.avatar_url);
                setGetCommits(json.data);
            });
    }
}

export default GetCommits