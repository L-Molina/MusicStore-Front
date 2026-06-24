const PostCard = ({id, title, body})=> {
    return(
        <>
        <h4>{id}</h4>
        <h3>{title}</h3>
        <p>{body}</p>
        </>
    )
}

export default PostCard