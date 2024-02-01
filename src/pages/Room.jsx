import React, { useState, useEffect } from 'react';
import client, { DATABASE_ID, databases, COLLECTIONS_ID } from '../appwriteConfig';
import { Trash2 } from 'react-feather';
import { ID, Query, Role, Permission } from 'appwrite';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';

const Room = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');

  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe([`databases.${DATABASE_ID}.collections.${COLLECTIONS_ID}.documents`], response => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        console.log("message created");
        setMessages(prevState => [response.payload, ...prevState]);
      }
      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        console.log("message deleted");
        setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id));
      }
    });
    return () => {
      unsubscribe();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody
    };

    const permissions = [
      Permission.write(Role.user(user.$id))
    ];

    const response = await databases.createDocument(DATABASE_ID, COLLECTIONS_ID, ID.unique(), payload, permissions);
    console.log('created', response);
    setMessageBody('');
  };

  const userDocumentExists = async (userId) => {
    try {
      await databases.getDocument(DATABASE_ID, COLLECTIONS_ID, userId);
      return true;
    } catch (error) {
      if (error.message.includes("Document with the requested ID could not be found")) {
        return false;
      }
      throw error;
    }
  };
  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS_ID, [
        Query.orderDesc('$createdAt'),
        Query.limit(21)
      ]);

      const messagesWithProfilePictures = await Promise.all(response.documents.map(async message => {
        try {
          // Check if the user document exists
          const userExists = await userDocumentExists(message.user_id);
          if (userExists) {
            // Fetch the user document
            const userResponse = await databases.getDocument(DATABASE_ID, COLLECTIONS_ID, message.user_id);
            const userProfile = userResponse.data;
            return {
              ...message,
              profilePictureUrl: userProfile.profilePictureUrl
            };
          } else {
            // Provide a default profile picture URL if the user document doesn't exist
            return {
              ...message,
              profilePictureUrl: 'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg?t=st=1706712680~exp=1706716280~hmac=393b819374675bea13710774b0aa1ed4fa3b94709a8b11795f05ae8ec4df0205&w=740'
            };
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          // Handle error fetching user document
          return {
            ...message,
            profilePictureUrl: 'https://img.freepik.com/premium-photo/cartoonish-3d-animation-boy-glasses-with-blue-hoodie-orange-shirt_899449-25777.jpg?w=740'
          };
        }
      }));

      setMessages(messagesWithProfilePictures);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const deleteMessage = async (message_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTIONS_ID, message_id);
  };

  return (
    <main className='container'>
      <div className='room--container'>
        <Header />
        <form onSubmit={handleSubmit} id="message--form">
          <div>
            <textarea
              required
              maxLength='1000'
              placeholder='wanna say something..'
              onChange={(e) => { setMessageBody(e.target.value) }}
              value={messageBody}
            ></textarea>
          </div>
          <div className='send-btn--wrapper'>
            <input className="btn btn--secondary" type='submit' value="SEND" />
          </div>
        </form>

        <div>
          {messages.map(message => (
            <div key={message.$id} className='messages--wrapper'>
              <div className='message--header'>
                <div className="profile-info">
                  {message.profilePictureUrl && (
                    <img src={message.profilePictureUrl} alt="Profile" className="profile-picture" />
                  )}
                  <div className="user-details">
                    <p>
                      {message?.username ? (
                        <span>{message.username}</span>
                      ) : (
                        <span>Anonymous user</span>
                      )}
                      <small className='message-timestamp'>{new Date(message.$createdAt).toLocaleString()}</small>
                    </p>
                  </div>
                </div>
                {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                  <Trash2 className="delete--btn" onClick={() => { deleteMessage(message.$id) }} />
                )}
              </div>
              <div className='message--body'>
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
export default Room;