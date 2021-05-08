import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  function changePasswordHandler(data) {
    fetch(`/api/user/change-password`, {
      method: `PATCH`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
