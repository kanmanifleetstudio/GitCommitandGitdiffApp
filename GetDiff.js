import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { display } from '../commponents/Display';

function GetDiff(){

    const {owner,repository,oid}=useParams();

    // const curl=`https://api.github.com/repos/${owner}/${repository}/commits/${oid}`;
    const curl=`http://localhost:8081/repos/${owner}/${repository}/commits/${oid}`;

    var [days,setDays] = useState();
    var [parentid,setParentid] = useState();
    var [commitedby,setCommittedby] = useState();
    var [authorname,setAuthorname] = useState();
    var [authorphoto,setAuthorphoto] = useState();
    var [authordate, setAuthordate] = useState();
    var [files, setFiles] = useState([]);
    var [filename,setFilename] = useState([]);
    var psha;

    useEffect( () => {
        axios.get(`https://api.github.com/users/${owner}`)
        .then(() =>{
            axios.get(`https://api.github.com/repos/${owner}/${repository}`)
            .then(() => {
                newFunction((err, result)=> {
                    // *always* check for err
                    if (err)
                        alert("Incorrect Oid for the given User's Repository");
                    else
                      console.log ('result', result)
                })
            })
            .catch((error) => {
                alert("Ivalid Repository for the given User")
                // alert("Repository "+error.message)
            })
        
        })
        .catch((error) => {
            alert("Invalid user")
            // alert("Invalid User ["+ error.message + "]")
        })

    },[curl,oid,owner,parentid,repository])

    files = files.slice(0,files.length/2);
    
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
                <div>
                    {files.map((file,index) =>(
                         <><button type="button" className="collapsiblelink" onClick={() => display(index)}>{filename[index]}</button>
                         <div className="content">
                            
                            {file.map(line => (
                            <tr>
                                <td>
                                  <span> {file.length}</span>
                                    </td>

                                <td>
                                   <span> 20  </span>
                                    </td>
                                <td>
                                    {line}
                                </td>
                                </tr>

                            ))}
                        </div></>
                    ))}
                </div>
            </article>
        </>

    </div>
    )

    function newFunction(done) {
        return axios.get(curl)
        .then((json)=>{
            if (json.data.name === 'Error')
            return done (Error ('Request failed with status code 422'))
        var currdate = new Date();
        checker()
        // const durl = `https://api.github.com/repos/${owner}/${repository}/compare/${psha}...${oid}`;
        const durl = `http://localhost:8081/repos/${owner}/${repository}/commits/${psha}/${oid}/diff`;
        axios.get(durl)
            .then((json_1) => {
                for (var i in json_1.data.files) {
                    var sam = json_1.data.files[i].patch.split("\n");
                    setFiles(files => [...files, sam]);
                    filename.push(json_1.data.files[i].filename);
                }
            })
            .catch((e) => {
                console.log("no patch found");
            });
            function checker() {
                if (json.data) {
                    console.log(json.data);
                    if (json.data.commit) {
                        if (json.data.commit.comitter) {
                            setDays(Math.floor((currdate - Date.parse(json.data.commit.committer.date)) / (1000 * 3600 * 24)));
                            setCommittedby(json.data.commit.committer.name);
                        }
                        if (json.data.commit.author) {
                            if (json.data.commit.author.name) {
                                setAuthorname(json.data.commit.author.name);
                            }
                        }
                    }
                    if (json.data.author) {
                        if (json.data.author.avatar_url) {
                            setAuthorphoto(json.data.author.avatar_url);
                        }
                    }
                    if (json.data.parents) {
                        psha = json.data.parents[0].sha;
                        setParentid(json.data.parents[0].sha);
                    }
                }
            }
        }).catch((err)=>console.error(err))
        
        
    }

}

export default GetDiff