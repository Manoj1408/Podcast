import React, { useState } from 'react'
import Header from '../components/common/Header'
import CreatePodcastForm from '../components/StartAPodcast/CreatePodcastForm';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CreateAPodcastPage() {

    
  return (
    <div>
      <Header />
      <div className="input-wrapper">
        <h1>Create A Podcast</h1>
        <CreatePodcastForm/>
      </div>
    </div>
  );
}

export default CreateAPodcastPage