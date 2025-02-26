export interface User{
        _id: String;
        username: String;
        email: String;
        currentlyReadingCount: Number;
        favoriteCount: Number;
        finishedReadingCount: Number;
        wantToReadCount: Number;
        bookCount: Number;
        isAdmin: Boolean;
}