const { useState } = React

export function LongTxt({ children: txt = '', length }) {
    const [isShowFullTxt, setIsShowLong] = useState(false);

    function onToggleIsShowLong() {
        setIsShowLong((isShowLong) => !isShowLong);
    }

    const isTextTooLong = txt.length > length;
    const textToShow = (isShowFullTxt || !isTextTooLong)
        ? txt
        : txt.substring(0, length) + '...';

    return (
        <section className="long-txt">
            <p className="txt">{textToShow}</p>
            {isTextTooLong && (
                <div>
                    <button className="show-txt-btn" onClick={onToggleIsShowLong}>
                        {isShowFullTxt ? 'Show Less' : 'Read More'}
                    </button>
                </div>
            )}
        </section>
    );
}
