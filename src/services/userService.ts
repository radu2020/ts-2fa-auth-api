interface IUser {
    name: string;
    email: string;
    mobile: string;
    password: string;
    secret?: string;
  }
  
  export const users = new Map<string, IUser>();

  
  // Find user by email
  export const findUserByEmail = (email: string): IUser | undefined => {
    return users.get(email);
  };
  
  // Update user details (name and email only)
  export const updateUserDetails = (email: string, name: string, newEmail: string): boolean => {
    const user = users.get(email)
    if (user) {
      if (newEmail !== email) {
        user.name = name;
        user.email = newEmail;
        users.set(newEmail, user)
        users.delete(email)
        return true;
      }
    }
    return false;
  };
  