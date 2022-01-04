import React, { useEffect, useRef, useState } from "react";
import { getMembersByWorkspace, getWorkspaceById } from "../../../../../_redux/workspace/workspaceCrud";
import { toast } from "react-toastify"
import axios from 'axios';
import { Button, Container, Popover, Overlay } from 'react-bootstrap';
import { MdClose, MdOutlineDashboard } from "react-icons/md";
import {
    lightGreyBackground, iconSize24, iconSize20, iconSize34,
    popoverDialogContainer
} from '../../../../board/components/BoardStyles';

import { BACKEND_ORIGIN } from '../../../../../../../../config';
const textStyle = {
    fontSize : "15px"
};

const workspaceDetailStyle = {
    backgroundColor : "#afafaf",

};


const buttonStyle = {
    backgroundColor: "#DFE1E6",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    borderRadius : "5px",
    width: "250px",
    height: "40px",
    padding: "0px"
};

const inputFieldStyle = {
    border: "2px solid #ccc",
    borderRadius: "3px"
}

const memberRowStyle = {
    marginTop: "15px"
}

const clickedButtonStyle = {
    backgroundColor: "#EEF0F8",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    borderRadius : "5px 5px 0px 0px"
};


function WorkspaceMemberMain(workspaceId){
    const [workspace, setWorkspace] = useState([])
    const [members, setMembers] = useState([])
    const [searchMembers, setSearchMembers] = useState([])
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [inviteQuery, setInviteQuery] = useState('');

    useEffect(()=>{
        getWorkspaceById(workspaceId.workspaceId).then(res=>{
          setWorkspace(res.data)
        }).catch(err=>{
          toast.error('Cannot get workspace', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true
            });
        })
        getMembersByWorkspace(workspaceId.workspaceId).then(res=>{
            setMembers(res.data)
            setSearchMembers(res.data)
        }).catch(err=>{
            toast.error('Cannot get members', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true
              });
          })
    }, [])
    console.log(members)
    const dialogInviteMemberTarget = useRef(null);
    const [isDialogInviteMemberOpen, setDialogInviteMember] = useState(false);
    const onInviteMemberButtonClicked = () => {
      if (isDialogInviteMemberOpen) {
        setDialogInviteMember(false);
      } else {
        setDialogInviteMember(true);
      }
    };
    const handleInviteInputOnChange = e => {
        setInviteQuery(e.target.value);
    }
    console.log(inviteQuery)
    useEffect(() => {
        if (inviteQuery) {
          // call API to search for candidates
          axios.get(`${BACKEND_ORIGIN}api/v1/users/`, { params: { query: inviteQuery } }).then(res => {
            if (res.data.count) {
              const resCandidates = res.data.results;
              console.log(resCandidates)
              let temp = [];
              for (let i = 0; i < resCandidates.length; i++) {
                let found = false;
                for (let j = 0; j < members.length; j++) {
                  if (members[j].id === resCandidates[i].id) {
                    found = true; break;
                  }
                }
                if (found) continue;
                found = false;
                for (let j = 0; j < selectedCandidates.length; j++) {
                  if (selectedCandidates[j].id === resCandidates[i].id) {
                    found = true; break;
                  }
                }
                if (!found) temp.push(resCandidates[i]);
              }
              setCandidates(temp);
            }
            else setCandidates([]);
          })
        }
        else {
          setCandidates([]);
        }
      }, [inviteQuery])
      console.log(candidates)
    function handleSearchMembers(searchTerm){
        if (searchTerm !==""){
            const searchRes = members.filter(({fullname}) => fullname.includes(searchTerm))
            console.log(searchRes)
            setSearchMembers(searchRes)
        } else if (searchTerm ==""){
            setSearchMembers(members)
        }
        console.log(searchMembers)
    }

    const handleSelectCandidate = candidate => {
        setInviteQuery('');
        setCandidates([]);
        setSelectedCandidates([...selectedCandidates, candidate]);
    }
    const removeSelectedCandidate = candidate => {
        if (!selectedCandidates) return;
    
        const temp = [...selectedCandidates];
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === candidate.id) {
            temp.splice(i, 1);
            setSelectedCandidates(temp);
            return;
          }
        }
    
      }
    
    const inviteMembers = e => {
        let idList = [];
        for (let i = 0; i < selectedCandidates.length; i++) idList.push(selectedCandidates[i].id);
        for(
            let i = 0; i < idList.length; i++
        ){
            axios.post(`${BACKEND_ORIGIN}api/v1/workspaces/${workspace.id}/members/`, { id: idList[i] }).then(res => {
                setMembers([...members, selectedCandidates]);
                console.log(selectedCandidates)
                console.log(searchMembers)
                // let newMembers = members.concat(selectedCandidates);
                // for (
                //     let i = 0; i < selectedCandidates.length; i++
                // ){
                //     setSearchMembers([...members, selectedCandidates[i]])
                // }
                // selectedCandidates.map(cand =>setSearchMembers([...searchMembers, cand]));
                setSearchMembers([...searchMembers, selectedCandidates])
                // setSearchMembers([...members, selectedCandidates]);
            }).catch(e => {
                alert("Có lỗi xảy ra khi mời thành viên mới");
            })
        }   



        setInviteQuery('');
        setCandidates([]);
        setSelectedCandidates([]);
        setDialogInviteMember(false);
        // setMembers(members);
    }

    // useEffect(()=>{
    //     getWorkspaceById(workspaceId.workspaceId).then(res=>{
    //       setWorkspace(res.data)
    //     }).catch(err=>{
    //       toast.error('Cannot get workspace', {
    //           position: 'top-right',
    //           autoClose: 5000,
    //           hideProgressBar: false,
    //           closeOnClick: true
    //         });
    //     })
    //     getMembersByWorkspace(workspaceId.workspaceId).then(res=>{
    //         setMembers(res.data)
    //         setSearchMembers(res.data)
    //     }).catch(err=>{
    //         toast.error('Cannot get members', {
    //             position: 'top-right',
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true
    //           });
    //       })
    // }, [])

    console.log(searchMembers)
    return (
        <>
        <div className="d-flex flex-row-fluid" style={{marginTop:"30px", marginLeft:"30px"}}>
            <div className="d-flex flex-column" style={{marginRight:"50px"}}>
                <h4>Members of Workspace boards</h4>
                <div className="navi-item" >
                    <button type="button" className="btn" style={buttonStyle}>Workspace members ({members.length})</button>
                </div>
            </div>
            <div className="d-flex flex-column w-75">
            <h2 style={{borderBottom:"2px solid"}}>Workspace members ({members.length})</h2>
            <p>Workspace members can view and join all Workspace boards and create new boards in the Workspace</p>
            <div className="d-flex flex-row justify-content-between">
                <div class="input-group input-group-sm mb-3">
                    <input type="text" onKeyUp={e => {if(e.key==='Enter'){handleSearchMembers(e.target.value)}}} placeholder="Filter by name" style={inputFieldStyle}></input>
                </div>
                <button class="btn" type="button" style={buttonStyle}
                ref={dialogInviteMemberTarget} onClick={onInviteMemberButtonClicked}>
                    Invite Workspace members
                </button>
                {/* Dialog invite member */}
                <Overlay target={dialogInviteMemberTarget.current} show={isDialogInviteMemberOpen} placement="bottom">
                    {(props) => (
                    <Popover {...props}>
                        <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                        {/* Header */}
                        <div className='d-flex justify-content-between align-items-center p-3'>
                            <div className='btn p-0' onClick={() => { setDialogInviteMember(false) }}>
                            <MdClose style={iconSize20} />
                            </div>
                            <h6 className='m-0'>Invite to workspace</h6>
                            <div className='btn p-0' onClick={() => { setDialogInviteMember(false) }}>
                            <MdClose style={iconSize20} />
                            </div>
                        </div>

                        <hr className='m-0' />

                        {/* Input field */}
                        <div className='p-3 d-flex flex-column'>
                            {/* Input field */}
                            <input type="text" className="form-control" placeholder='Email address or name...' onChange={handleInviteInputOnChange} value={inviteQuery} />

                            {/* Candidates card item */}
                            <div className="mt-3 d-flex flex-column" >
                            {candidates && candidates.map(candidate =>
                                <button className="d-flex align-items-center p-3 mb-2 border-0 rounded" style={lightGreyBackground} onClick={() => handleSelectCandidate(candidate)} key={candidate.id}>
                                <img src={candidate.avatar} className="rounded-circle" style={iconSize24}></img>
                                <p className="ml-5 mb-0" style={{ fontSize: '12px' }}>{candidate.first_name} {candidate.last_name}</p>
                                </button>
                            )}
                            </div>

                            {/* Selected candidates chip item */}
                            <div style={{ minHeight: '150px' }}>
                            <div className="d-flex mt-2 flex-row flex-wrap">
                                {selectedCandidates && selectedCandidates.map(candidate =>
                                <span className="badge badge-pill badge-light py-2 px-4 mr-2 mb-2 align-items-center" style={{ fontSize: '12px' }} key={candidate.id}>
                                    {candidate.first_name} {candidate.last_name}
                                    <div className='btn p-0 ml-2' onClick={() => removeSelectedCandidate(candidate)}>
                                    <MdClose style={iconSize20} />
                                    </div>
                                </span>
                                )}
                            </div>
                            </div>

                        </div>

                        {/* Button send invite */}
                        <Button variant='primary' className='mx-3 mb-3 mt-0' disabled={selectedCandidates.length === 0} onClick={inviteMembers}>
                            Send invitation
                        </Button>

                        </div>
                    </Popover>
                    )}
                </Overlay>
            </div>
            <div className="d-flex flex-column">
                {
                    searchMembers.map(member =>
                        <div className="d-flex flex-row" style={memberRowStyle}>
                            <div className="d-flex flex-row mr-auto align-items-center">
                                <img src={member.avatar} class="rounded-circle" alt="Cinque Terre" width="50" height="50"></img>
                                <h5 style={{marginLeft:"5px"}}>{member.firstname.concat(" "+member.lastname)}</h5>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Admin</button>
                                <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Remove</button>
                            </div>
                        </div>
                        )
                }
            </div>
        </div>
        </div>
        </>
    )
}

export default WorkspaceMemberMain