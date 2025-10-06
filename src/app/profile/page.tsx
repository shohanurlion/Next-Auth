'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ProfilePage = () => {
  const [profile, setProfile] = useState<string | null>(null);

  React.useEffect(() => {
    const getDataUser = async () => {
      try {
        const res = await axios.post("/api/users/me");
        console.log(res.data.user);
        
        setProfile(res.data.user?._id ?? null);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };
    getDataUser();
  }, []);

  return (
    <div>
      <h2>Profile Page</h2>
      {profile ? (
        <p>User ID: {profile}</p>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default ProfilePage;