import Link from 'next/link';

const Component = () => {
    return (
        <div className="markdown">
            <p>
                Якщо Ви помітили матеріал на нашому сайті, що порушує Ваші
                авторські права, або іншим чином дотичне до Вас, будь ласка,
                звʼяжіться з нами для розвʼязання цього питання. Для цього
                потрібно <strong>відправити лист</strong> на нашу електронну
                пошту, в якому міститься наступне:
            </p>
            <ul>
                <li>посилання на спірний матеріал нашого сайту</li>
                <li>
                    контактні дані, для звʼязку з Вами завірені копії
                    документів, що підтверджують ваше право на матеріал
                </li>
            </ul>
            <p>
                Адреса нашої електронної пошти{' '}
                <Link target="_blank" href="mailto:support@hikka.io">
                    support@hikka.io
                </Link>
            </p>
            <p>
                Ваш лист та предʼявлені документи будуть перевірені в найкоротші
                терміни, та з Вами звʼяжуться для урегулювання питання
                матеріалу. Увесь контент на нашому сайті отриманий з відкритих
                джерел та не для продажу, а служить тільки в ознайомчих цілях.
            </p>
        </div>
    );
};

export default Component;
