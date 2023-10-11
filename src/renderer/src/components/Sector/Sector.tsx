import { FunctionComponent } from 'react'
import { motion } from 'framer-motion'
interface OwnProps {
  sector: number
}

type Props = OwnProps

const Sector: FunctionComponent<Props> = ({ sector }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 133 133"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_81013_146)">
        <motion.path
          whileHover={{ fill: 'ffcc00' }}
          d="M66.3944 67.016L117.779 96.6826C112.6 105.652 105.139 113.092 96.1444 118.256C87.1499 123.419 76.9392 126.125 66.5387 126.099C56.1381 126.074 45.9142 123.319 36.8944 118.111C27.8746 112.904 20.3767 105.427 15.1545 96.4326L66.3944 67.016Z"
          fill="#ee4444"
          id="p1"
        />
        <motion.path
          d="M66.933 66.7497L15.2022 96.35C9.91271 87.2694 7.1067 76.981 7.06619 66.519C7.02568 56.0569 9.75211 45.7899 14.9714 36.7497C20.1908 27.7096 27.7191 20.2149 36.7997 15.019C45.8804 9.82302 56.1934 7.10891 66.7022 7.14941L66.933 66.7497Z"
          fill="#00cc88"
          whileHover={{ fill: '#0099ff' }}
        />
        <motion.path
          d="M66.3944 67.0165L66.683 7.1832C77.1275 7.13253 87.3746 9.84743 96.3944 15.055C105.414 20.2626 112.889 27.7794 118.067 36.8499C123.246 45.9204 125.945 56.2249 125.894 66.7279C125.844 77.2308 123.045 87.5621 117.779 96.6832L66.3944 67.0165Z"
          fill="#8855ff"
          whileHover={{ fill: '#ff0055' }}
        />
        <g clipPath="url(#clip1_81013_146)">
          <text>sadawd</text>
          <path
            d="M97.3086 27.879C94.6707 27.3002 92.043 27.5069 89.6679 28.3412L100.939 36.1394L99.6798 28.6215C98.9251 28.3097 98.1336 28.06 97.3086 27.879V27.879ZM100.651 29.0674L102.929 42.4456L107.303 36.2949C106.045 33.208 103.706 30.6124 100.651 29.0674V29.0674ZM88.7588 28.6965C85.6449 30.0396 83.0503 32.4915 81.576 35.6696L95.1989 33.1388L88.7588 28.6965V28.6965ZM107.607 37.1177L99.8921 48.2965L107.295 46.8827C107.593 46.1519 107.832 45.3869 108.006 44.5905L108.07 44.2842C108.556 41.8066 108.358 39.352 107.607 37.1177V37.1177ZM88.7914 35.2156L81.2046 36.5489C80.9556 37.1989 80.7506 37.8763 80.5969 38.5769C80.0139 41.2344 80.229 43.8817 81.0789 46.2707L88.7914 35.2156ZM85.6434 41.0928L81.4656 47.2446C82.7946 50.2499 85.1616 52.7599 88.2164 54.228L85.6434 41.0928V41.0928ZM106.923 47.7166L93.6476 50.2919L99.7517 54.5116C102.835 53.2083 105.417 50.8197 106.923 47.7166ZM87.7809 47.3193L89.0655 54.6015C89.7773 54.8871 90.521 55.1185 91.2948 55.2882C93.9178 55.8637 96.5312 55.6626 98.8956 54.8399L87.7809 47.3193V47.3193Z"
            fill="#304770"
          />
          <path
            d="M94.8012 48.765C94.7968 48.6166 94.8162 48.48 94.8443 48.4616C94.9109 48.4179 94.9225 48.8489 94.8576 48.9555C94.823 49.0124 94.807 48.9585 94.8012 48.765L94.8012 48.765ZM93.8559 48.4622C93.8981 48.4333 93.9867 48.4079 94.0529 48.4056C94.2517 48.399 94.6851 48.1777 95.048 47.8976C95.4184 47.6117 95.6105 47.2912 95.6643 46.8691C95.7232 46.4068 95.4885 45.9529 95.1386 45.852C95.0489 45.8262 95.0322 45.7763 95.0251 45.5133C95.0154 45.1508 95.0358 45.1425 95.4232 45.3511C95.7794 45.5429 96.103 45.9284 96.1824 46.2555C96.2528 46.5455 96.2126 47.0228 96.0914 47.3365C95.9306 47.753 95.3608 48.1733 94.6365 48.4098C94.3274 48.5107 93.7262 48.5511 93.8559 48.4621L93.8559 48.4622ZM94.7483 47.5926C94.7289 47.4429 94.6858 46.7826 94.6526 46.1252C94.6194 45.4679 94.5679 44.5721 94.5382 44.1347L94.4842 43.3393L94.708 43.3496L94.9318 43.3599L94.9322 43.8022C94.9325 44.0454 94.9199 44.5961 94.9043 45.0258C94.8886 45.4555 94.8732 46.2695 94.8699 46.8349C94.8642 47.8445 94.8182 48.1307 94.7483 47.5926L94.7483 47.5926ZM93.8061 45.6813C92.9495 45.5187 92.4904 45.1189 92.3678 44.4287C92.3146 44.1287 92.4685 43.601 92.6933 43.3127C93.0259 42.8862 93.6586 42.6222 94.5548 42.5357C95.317 42.4622 95.8316 42.2854 96.1198 41.9982C96.2579 41.8605 96.3765 41.5823 96.3702 41.4106C96.3636 41.2302 96.1638 40.8551 96.0006 40.7168C95.8468 40.5865 95.2682 40.307 95.1583 40.3098C95.1133 40.311 95.0906 40.213 95.0847 39.9924L95.0761 39.6733L95.3664 39.6995C96.2636 39.7806 97.0565 40.3076 97.2493 40.951C97.4902 41.7551 96.9675 42.5866 95.9964 42.9441C95.788 43.0209 95.3815 43.1009 94.9199 43.1562C94.3508 43.2244 94.1155 43.2758 93.9089 43.3772C93.4187 43.6178 93.1559 44.1512 93.3522 44.5071C93.5093 44.792 93.7974 44.9497 94.4287 45.0963C94.4719 45.1064 94.497 45.218 94.5025 45.4251L94.511 45.7387L94.3159 45.7398C94.2086 45.7404 93.9793 45.7141 93.8062 45.6812L93.8061 45.6813ZM94.5017 42.347C94.4655 42.2409 94.3856 40.9345 94.295 38.9672L94.2119 37.1612L94.6438 37.1496L95.0758 37.1379L95.0612 37.7497C94.9978 40.4034 94.9637 41.5967 94.941 41.9547L94.9146 42.3717L94.7196 42.3931C94.5926 42.4071 94.5167 42.391 94.5017 42.347L94.5017 42.347ZM93.6382 40.3685C92.7227 40.2672 92.0071 39.9158 91.6214 39.3782C91.5456 39.2725 91.4405 39.0142 91.3881 38.8044C91.2263 38.1577 91.3425 37.7033 91.7946 37.2145C92.4061 36.5532 93.0073 36.3902 95.2707 36.2716C95.8135 36.2432 96.2993 36.2056 96.3503 36.188C96.4012 36.1704 96.5899 36.2216 96.7695 36.3017C96.9492 36.3818 97.1726 36.4615 97.2661 36.4788C97.5087 36.5238 97.4829 36.6385 97.2196 36.6856C96.8855 36.7454 96.8268 36.8037 97.0099 36.8942L97.1622 36.9694L97.0114 37.032C96.7324 37.1477 96.4387 37.1648 95.9935 37.0911C95.4046 36.9937 94.031 36.9797 93.6275 37.067C93.0539 37.1912 92.484 37.5865 92.2978 37.9895C92.1444 38.3215 92.3102 38.8832 92.6524 39.1905C92.9237 39.4343 93.3898 39.598 93.841 39.608L94.2466 39.6171L94.2414 39.9889L94.2362 40.3607L94.0024 40.3718C93.8739 40.378 93.71 40.3765 93.6382 40.3685L93.6382 40.3685ZM96.708 36.5216C96.7073 36.493 96.6729 36.4705 96.6317 36.4716C96.5905 36.4727 96.543 36.4974 96.5261 36.5265C96.5092 36.5556 96.5435 36.5781 96.6024 36.5765C96.6613 36.5749 96.7088 36.5502 96.708 36.5216ZM97.219 36.8054C97.2321 36.7827 97.3881 36.7656 97.5654 36.7674C97.7428 36.7691 97.9122 36.7546 97.942 36.7351C97.9717 36.7156 97.9969 36.733 97.998 36.7736C97.9996 36.8322 97.9161 36.8475 97.5975 36.8472C97.3761 36.8469 97.2058 36.8282 97.219 36.8054L97.219 36.8054ZM94.1675 35.9924C94.1398 35.8637 94.0784 35.7828 93.9532 35.71C93.5535 35.4775 93.7154 34.9834 94.2435 34.8241C94.7066 34.6843 95.084 34.7572 95.3108 35.0302C95.4842 35.2389 95.4631 35.4581 95.2436 35.7292C95.1399 35.8571 95.0634 36.0039 95.0735 36.0553C95.0901 36.1394 95.0474 36.15 94.6492 36.1608L94.2064 36.1727L94.1676 35.9923L94.1675 35.9924Z"
            fill="#304770"
          />
        </g>
      </g>

      <defs>
        <clipPath id="clip0_81013_146">
          <rect width="133" height="133" fill="white" />
        </clipPath>
        <clipPath id="clip1_81013_146">
          <rect width="29.1012" height="29.1012" fill="white" transform="translate(79.7362 27)" />
        </clipPath>
      </defs>
      {/*<text style="font-size: 24px;">*/}
      {/*  <textPath xlink:href="#p1" startOffset="50%" text-anchor="middle">*/}
      {/*    1test text*/}
      {/*  </textPath>*/}
      {/*</text>*/}
    </svg>
  )
}

export default Sector